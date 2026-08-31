# @mindfiredigital/page-builder-cli

`pagectl` — a stable, scriptable, self-describing CLI for [@mindfiredigital/page-builder](../core) pages. Designed to be driven by scripts and agents as easily as by hand: every command supports `--json` for machine-readable output, and `pagectl schema` prints the full command tree, canvas info, block palette, and flag enums in one shot.

> v1 covers flat, top-level, absolute-mode pages (`text` / `header` / `button` / `container` / `image` blocks).

## Install

```bash
npm install -g @mindfiredigital/page-builder-cli
# or run without installing
npx @mindfiredigital/page-builder-cli --help
```

## Quick start

```bash
pagectl add-block --type text --content "Hello world"
pagectl add-block --type button --content "Click me" --below <id-of-previous-block>
pagectl inspect
pagectl validate
pagectl build --out ./dist
pagectl serve
```

All commands operate on a page JSON file, defaulting to `.pagectl/page.json` in the current directory (auto-created on first use unless noted otherwise).

## Commands

| Command                 | Description                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `pagectl schema`        | Print the machine-readable command tree, canvas info, block palette, and every flag enum.                                 |
| `pagectl status`        | Report the page file's existence/block count, and whether a `serve` session is already running.                           |
| `pagectl list-blocks`   | Print the block palette and defaults.                                                                                     |
| `pagectl new <slug>`    | Explicitly create an additional, separately named page.                                                                   |
| `pagectl add-block`     | Add a block to the page, auto-creating it if needed. Default placement is auto-flow.                                      |
| `pagectl update-block`  | Nudge a block one grid step, jump to an explicit `--x/--y`, and/or fix its content/style/class.                           |
| `pagectl remove-block`  | Remove a block from a page.                                                                                               |
| `pagectl reorder-block` | Change a block's array order (auto-flow/z-order), not its position.                                                       |
| `pagectl inspect`       | Print canvas info, next auto-flow y, and every block's box.                                                               |
| `pagectl validate`      | Schema + scope + overlap + out-of-bounds + stale-`inlineStyle` checks, each with a fix hint. Pass `--fix` to auto-repair. |
| `pagectl build`         | Rough static HTML/CSS export for shipping/inspection — **not** pixel parity with the real editor.                         |
| `pagectl serve [file]`  | Serve the real page-builder editor backed by the page file; watches it on disk for live updates.                          |

Run `pagectl <command> --help` or `pagectl schema` for the full flag list per command.

## Common flags

- `--page <file>` — page JSON file to operate on (default: `.pagectl/page.json`).
- `--json` — emit structured JSON to stdout instead of human-readable text. This is honored even on errors/crashes — output is always valid single-line JSON on stdout when `--json` is passed, never split across stdout/stderr.
- `--dry-run` — compute and report the result without writing anything to disk.
- `--no-input` — fail fast instead of prompting. `pagectl` never actually prompts, so this is always the effective behavior; the flag exists for scripts that want to assert it explicitly.

## Notes on `pagectl build`

`build` produces a template-based static export (no headless browser), close to but **not** pixel-identical to the real editor's rendering — use `pagectl serve` when you need an accurate live view.

## Package Compatibility

`@mindfiredigital/page-builder-cli` depends on `@mindfiredigital/page-builder` (core) and `@mindfiredigital/page-builder-web-component`. All four packages in this project are developed and released together from the same monorepo — upgrade them together rather than pinning one far behind the others.

## A note on `--out` / `--page` paths

`pagectl` treats `--out` and `--page` as trusted local paths, the same way `tsc --outDir` or `webpack --output-path` do — it will happily write outside the current directory if you pass e.g. `--out ../../elsewhere`. This is fine for interactive/local use. If you're scripting `pagectl` against a `--page` file you don't otherwise trust (e.g. a third-party page JSON in an automated pipeline), treat that the same way you'd treat any other untrusted input to a build tool.

## License

MIT
