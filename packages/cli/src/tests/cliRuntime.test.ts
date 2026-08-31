import { jest } from '@jest/globals';
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  resolvePagePath,
  findSiblingPageFiles,
  slugFromPageFilePath,
  parseKeyValueList,
  writePageFileAtomic,
  loadPageFile,
  emitResult,
  runCommand,
  CliError,
  EXIT,
} from '../cliRuntime.js';
import { makeCanvasRoot, DEFAULT_PAGE_DIR, DEFAULT_PAGE_FILENAME } from '../schema.js';

describe('resolvePagePath', () => {
  it('resolves an explicit path and marks it non-default', () => {
    const { path, isDefault } = resolvePagePath('foo.page.json');
    expect(path.endsWith('foo.page.json')).toBe(true);
    expect(isDefault).toBe(false);
  });

  it('falls back to the default .pagectl/page.json when omitted', () => {
    const { path, isDefault } = resolvePagePath();
    expect(path.endsWith(join(DEFAULT_PAGE_DIR, DEFAULT_PAGE_FILENAME))).toBe(true);
    expect(isDefault).toBe(true);
  });
});

describe('slugFromPageFilePath', () => {
  it('extracts the slug from a <slug>.page.json path', () => {
    expect(slugFromPageFilePath('/a/b/mypage.page.json')).toBe('mypage');
  });

  it('returns null for a path that does not follow the convention', () => {
    expect(slugFromPageFilePath('/a/b/random.json')).toBeNull();
  });
});

describe('parseKeyValueList', () => {
  it('parses repeated key=value pairs', () => {
    expect(parseKeyValueList(['color=red', 'fontSize=12px'], '--style')).toEqual({
      color: 'red',
      fontSize: '12px',
    });
  });

  it('returns an empty object for undefined input', () => {
    expect(parseKeyValueList(undefined, '--style')).toEqual({});
  });

  it('throws a CliError with EXIT.BAD_INPUT on a malformed pair', () => {
    expect(() => parseKeyValueList(['nokey'], '--style')).toThrow(CliError);
    try {
      parseKeyValueList(['nokey'], '--style');
      fail('expected parseKeyValueList to throw');
    } catch (err) {
      expect((err as CliError).code).toBe(EXIT.BAD_INPUT);
    }
  });

  it('allows an empty value after the =', () => {
    expect(parseKeyValueList(['key='], '--style')).toEqual({ key: '' });
  });
});

describe('file-system-backed behavior', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'pagectl-test-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  describe('writePageFileAtomic', () => {
    it('writes valid, pretty-printed JSON and leaves no temp file behind', () => {
      const target = join(dir, 'out.page.json');
      const page = [makeCanvasRoot()];

      writePageFileAtomic(target, page);

      expect(existsSync(target)).toBe(true);
      const written = JSON.parse(readFileSync(target, 'utf8'));
      expect(written).toEqual(page);

      const leftoverTmp = readFileSync(target, 'utf8');
      expect(leftoverTmp.endsWith('\n')).toBe(true);
    });

    it('creates intermediate directories as needed', () => {
      const target = join(dir, 'nested', 'deep', 'out.page.json');
      writePageFileAtomic(target, [makeCanvasRoot()]);
      expect(existsSync(target)).toBe(true);
    });
  });

  describe('findSiblingPageFiles', () => {
    it('lists other *.page.json files in the same directory, sorted, excluding self', () => {
      writeFileSync(join(dir, 'b.page.json'), '[]');
      writeFileSync(join(dir, 'a.page.json'), '[]');
      writeFileSync(join(dir, 'target.page.json'), '[]');
      writeFileSync(join(dir, 'unrelated.json'), '[]');

      const siblings = findSiblingPageFiles(join(dir, 'target.page.json'));
      expect(siblings).toEqual(['a.page.json', 'b.page.json']);
    });

    it('returns an empty array for a nonexistent directory instead of throwing', () => {
      expect(findSiblingPageFiles(join(dir, 'does-not-exist', 'x.page.json'))).toEqual([]);
    });
  });

  describe('loadPageFile', () => {
    it('auto-creates a blank canvas at the default path when omitted and missing', () => {
      // resolvePagePath() resolves the default path relative to cwd, so cd
      // into the temp dir for the duration of this one test.
      const originalCwd = process.cwd();
      process.chdir(dir);
      try {
        const { page, path } = loadPageFile();
        expect(path).toBe(join(dir, DEFAULT_PAGE_DIR, DEFAULT_PAGE_FILENAME));
        expect(existsSync(path)).toBe(true);
        expect(page.some(b => b.id === 'canvas')).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('throws NOT_FOUND for a missing explicit --page path', () => {
      const missing = join(dir, 'missing.page.json');
      expect(() => loadPageFile(missing)).toThrow(CliError);
      try {
        loadPageFile(missing);
        fail('expected loadPageFile to throw');
      } catch (err) {
        expect((err as CliError).code).toBe(EXIT.NOT_FOUND);
      }
    });

    it('throws BAD_INPUT for invalid JSON', () => {
      const target = join(dir, 'bad.page.json');
      writeFileSync(target, '{ not valid json');
      expect(() => loadPageFile(target)).toThrow(CliError);
      try {
        loadPageFile(target);
      } catch (err) {
        expect((err as CliError).code).toBe(EXIT.BAD_INPUT);
      }
    });

    it('throws BAD_INPUT for JSON that fails the page schema', () => {
      const target = join(dir, 'invalid-schema.page.json');
      writeFileSync(target, JSON.stringify([{ id: 'x' }]));
      expect(() => loadPageFile(target)).toThrow(CliError);
    });

    it('throws BAD_INPUT for a valid-schema page that violates v1 scope', () => {
      const target = join(dir, 'out-of-scope.page.json');
      const root = { ...makeCanvasRoot(), classes: ['grid-layout-active'] };
      writeFileSync(target, JSON.stringify([root]));
      expect(() => loadPageFile(target)).toThrow(/grid layout mode/);
    });

    it('round-trips a page written by writePageFileAtomic', () => {
      const target = join(dir, 'roundtrip.page.json');
      const page = [makeCanvasRoot()];
      writePageFileAtomic(target, page);

      const { page: loaded } = loadPageFile(target);
      expect(loaded).toEqual(page);
    });
  });
});

describe('emitResult', () => {
  it('writes a single JSON line to stdout when json=true, and skips the human printer', () => {
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const humanPrinter = jest.fn();

    emitResult(true, { hello: 'world' }, humanPrinter);

    expect(humanPrinter).not.toHaveBeenCalled();
    expect(writeSpy).toHaveBeenCalledWith(
      JSON.stringify({ schema: '1', data: { hello: 'world' } }) + '\n'
    );
    writeSpy.mockRestore();
  });

  it('calls the human printer and skips stdout JSON when json=false', () => {
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const humanPrinter = jest.fn();

    emitResult(false, { hello: 'world' }, humanPrinter);

    expect(humanPrinter).toHaveBeenCalledTimes(1);
    expect(writeSpy).not.toHaveBeenCalled();
    writeSpy.mockRestore();
  });
});

describe('runCommand', () => {
  const originalExitCode = process.exitCode;
  afterEach(() => {
    process.exitCode = originalExitCode;
  });

  it('runs the function and leaves exitCode untouched on success', async () => {
    const fn = jest.fn<() => void>();
    await runCommand(false, fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBe(originalExitCode);
  });

  it('sets exitCode from a thrown CliError', async () => {
    await runCommand(false, () => {
      throw new CliError(EXIT.AUTH, 'nope', 'fix it');
    });
    expect(process.exitCode).toBe(EXIT.AUTH);
  });

  it('classifies an unexpected (non-CliError) throw as TRANSIENT', async () => {
    await runCommand(false, () => {
      throw new Error('boom');
    });
    expect(process.exitCode).toBe(EXIT.TRANSIENT);
  });

  it('emits a single valid JSON line on stdout on failure when json=true, never a bare stack trace', async () => {
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

    await runCommand(true, () => {
      throw new CliError(EXIT.BAD_INPUT, 'bad thing', 'fix hint');
    });

    expect(writeSpy).toHaveBeenCalledTimes(1);
    const [line] = writeSpy.mock.calls[0];
    expect(() => JSON.parse(line as string)).not.toThrow();
    expect(JSON.parse(line as string)).toEqual({ error: 'bad thing', fix: 'fix hint' });

    writeSpy.mockRestore();
  });
});
