import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { pageSchema, checkScope, makeCanvasRoot, DEFAULT_PAGE_DIR, DEFAULT_PAGE_FILENAME, type Block } from './schema.js';

const PAGE_FILE_SUFFIX = '.page.json';

/** Resolves --page: an explicit path if given, otherwise the one default
    page file for this directory (.pagectl/page.json) that every command
    falls back to. `isDefault` tells loadPageFile() whether it's safe to
    auto-create a missing file — never for an explicit path, since a typo
    there should surface as an error, not silently start a fresh page. */
export function resolvePagePath(explicit?: string): { path: string; isDefault: boolean } {
  if (explicit) return { path: resolve(explicit), isDefault: false };
  return { path: resolve(DEFAULT_PAGE_DIR, DEFAULT_PAGE_FILENAME), isDefault: true };
}

/** Other *.page.json files sitting next to `targetPath`, excluding it —
    used to nudge an agent toward a page that already exists instead of
    letting it invent a fresh one when it typo'd or forgot the real path. */
export function findSiblingPageFiles(targetPath: string): string[] {
  const dir = dirname(targetPath);
  const self = basename(targetPath);
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith(PAGE_FILE_SUFFIX) && f !== self)
      .sort();
  } catch {
    return [];
  }
}

/** "mypage.page.json" -> "mypage"; null if the path doesn't follow the
    <slug>.page.json convention "new" produces by default. */
export function slugFromPageFilePath(targetPath: string): string | null {
  const name = basename(targetPath);
  return name.endsWith(PAGE_FILE_SUFFIX) ? name.slice(0, -PAGE_FILE_SUFFIX.length) : null;
}

export const EXIT = {
  OK: 0,
  BAD_INPUT: 2,
  AUTH: 3,
  NOT_FOUND: 4,
  TRANSIENT: 5,
} as const;

export class CliError extends Error {
  code: number;
  fix: string;
  constructor(code: number, message: string, fix: string) {
    super(message);
    this.code = code;
    this.fix = fix;
  }
}

export function badInput(message: string, fix: string): never {
  throw new CliError(EXIT.BAD_INPUT, message, fix);
}

export function notFoundErr(message: string, fix: string): never {
  throw new CliError(EXIT.NOT_FOUND, message, fix);
}

export function transientErr(message: string, fix: string): never {
  throw new CliError(EXIT.TRANSIENT, message, fix);
}

export interface LoadedPage {
  page: Block[];
  path: string;
}

/** Reads, JSON-parses, schema-validates and scope-checks a page file.
    `explicitPath` omitted -> resolves to the default page file and
    auto-creates it (blank canvas) if it doesn't exist yet, so any command
    — read or write — converges on the same file with zero setup. An
    explicit --page that doesn't exist is still a hard error (with sibling
    hints), since silently starting a fresh page there could paper over a
    typo. */
export function loadPageFile(explicitPath?: string): LoadedPage {
  const { path: resolved, isDefault } = resolvePagePath(explicitPath);

  if (!existsSync(resolved)) {
    if (isDefault) {
      const fresh = [makeCanvasRoot()];
      writePageFileAtomic(resolved, fresh);
      return { page: fresh, path: resolved };
    }

    const slug = slugFromPageFilePath(resolved);
    const createHint = slug ? `pagectl new ${slug}` : `pagectl new <slug> --out ${resolved}`;
    const siblings = findSiblingPageFiles(resolved);

    const fix =
      siblings.length > 0
        ? `Found existing page file(s) in this directory: ${siblings.join(', ')}. Pass one of them as --page if that's what you meant, or create a new one with "${createHint}".`
        : `Create it first with "${createHint}", or omit --page to use the default page at ${DEFAULT_PAGE_DIR}/${DEFAULT_PAGE_FILENAME}.`;

    notFoundErr(`Page file not found: ${resolved}`, fix);
  }

  let raw: string;
  try {
    raw = readFileSync(resolved, 'utf8');
  } catch (err) {
    transientErr(
      `Could not read ${resolved}: ${(err as Error).message}`,
      'Check file permissions and retry.'
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    badInput(
      `Invalid JSON in ${resolved}: ${(err as Error).message}`,
      'Fix the JSON syntax by hand, or regenerate the file with "pagectl new".'
    );
  }

  const parsed = pageSchema.safeParse(data);
  if (!parsed.success) {
    badInput(
      `${resolved} does not match the page schema: ${parsed.error.issues
        .map(i => `${i.path.join('.') || '(root)'}: ${i.message}`)
        .join('; ')}`,
      `Run "pagectl validate --page ${resolved}" for full details.`
    );
  }

  const violation = checkScope(parsed.data);
  if (violation) {
    badInput(violation.reason, violation.fix);
  }

  return { page: parsed.data, path: resolved };
}

/** Write to a temp file, then rename over the target — a crash mid-write
    can never corrupt the page JSON. */
export function writePageFileAtomic(filePath: string, page: Block[]): string {
  const resolved = resolve(filePath);
  mkdirSync(dirname(resolved), { recursive: true });
  const tmp = `${resolved}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tmp, JSON.stringify(page, null, 2) + '\n', 'utf8');
  renameSync(tmp, resolved);
  return resolved;
}

export interface BaseFlags {
  json?: boolean;
  dryRun?: boolean;
  force?: boolean;
  noInput?: boolean;
}

/** `--json` -> exactly one line of `{"schema":"1","data":...}` on stdout.
    Any other mode prints via `humanPrinter`, still only the result on
    stdout — callers must route progress/log lines through console.error. */
export function emitResult(json: boolean, data: unknown, humanPrinter: () => void): void {
  if (json) {
    process.stdout.write(JSON.stringify({ schema: '1', data }) + '\n');
  } else {
    humanPrinter();
  }
}

/** Wraps a command action so every failure — expected CliError or an
    unexpected crash — becomes a single valid-JSON line on stdout in --json
    mode (never a stack trace on stderr only), with a classified exit code. */
export async function runCommand(json: boolean, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    const cliErr =
      err instanceof CliError
        ? err
        : new CliError(
            EXIT.TRANSIENT,
            err instanceof Error ? err.message : String(err),
            'Unexpected error — re-run the command in isolation, or file an issue with this output.'
          );

    if (json) {
      process.stdout.write(JSON.stringify({ error: cliErr.message, fix: cliErr.fix }) + '\n');
    } else {
      console.error(`Error: ${cliErr.message}`);
      console.error(`Fix: ${cliErr.fix}`);
    }
    process.exitCode = cliErr.code;
  }
}

/** Parses repeatable "key=value" flags (--style, --class) into an object;
    malformed pairs are a bad-input error, not a silent skip. */
export function parseKeyValueList(pairs: string[] | undefined, flagName: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const pair of pairs ?? []) {
    const eq = pair.indexOf('=');
    if (eq <= 0) {
      badInput(
        `Malformed ${flagName} value "${pair}" — expected "key=value".`,
        `Pass it as e.g. ${flagName} color=#e11.`
      );
    }
    out[pair.slice(0, eq)] = pair.slice(eq + 1);
  }
  return out;
}
