---
sidebar_position: 5
---

# CLI

`pagectl` is a scriptable, self-describing command-line interface for `@mindfiredigital/page-builder` pages — built for scripts and agents to drive as easily as a person would from a terminal.

> v1 covers flat, top-level, absolute-mode pages (`text` / `header` / `button` / `container` / `image` blocks). Grid-mode pages, nested containers, and other component types (`video`, `table`, `richtext`, `link`, `twoCol`, `threeCol`, `landingpage`, multi-page projects) are out of scope for v1 — run `pagectl schema` for the authoritative list.

## Installation

```bash
npm install -g @mindfiredigital/page-builder-cli
# or run without installing
npx @mindfiredigital/page-builder-cli --help
```

## Quick start

```bash
pagectl add-block --type text --content "Hello world"
pagectl add-block --type image --src "https://example.com/photo.png" --below <id-of-previous-block>
pagectl inspect
pagectl validate
pagectl build --out ./dist
pagectl serve
```

Commands operate on a page JSON file, defaulting to `.pagectl/page.json` in the current directory (auto-created on first use unless noted otherwise).

## Command reference

| Command                 | Description                                                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `pagectl schema`        | Print the machine-readable command tree, canvas info, block palette, and every flag enum — the source of truth for scripting against `pagectl`. |
| `pagectl status`        | Report the page file's existence/block count, and whether a `serve` session is already running.                                                 |
| `pagectl list-blocks`   | Print the block palette and defaults.                                                                                                           |
| `pagectl new <slug>`    | Explicitly create an additional, separately named page.                                                                                         |
| `pagectl add-block`     | Add a block to the page, auto-creating it if needed. `--src` sets the image URL for `--type image` (that type takes no `--content`).            |
| `pagectl update-block`  | Nudge, move, or edit an existing block. `--src` changes an existing image block's URL.                                                          |
| `pagectl remove-block`  | Remove a block from a page.                                                                                                                     |
| `pagectl reorder-block` | Change a block's array order (auto-flow/z-order), not its position.                                                                             |
| `pagectl inspect`       | Print canvas info and every block's box.                                                                                                        |
| `pagectl validate`      | Run schema/scope/overlap/bounds checks, with `--fix` to auto-repair.                                                                            |
| `pagectl build`         | Rough static HTML/CSS export — not pixel parity with the real editor; use `serve` for that.                                                     |
| `pagectl serve [file]`  | Serve the real page-builder editor backed by the page file, with live file-watch updates.                                                       |

Every command supports `--json` for machine-readable output (including on errors — output stays on stdout as a single valid JSON line) and most support `--dry-run` to preview a change without writing it.

For the full flag list per command, either run `pagectl <command> --help` or `pagectl schema` for a single machine-readable dump of the entire command surface.

## Why a CLI for a UI page builder?

`pagectl` lets you script page construction and validation — useful for CI checks on committed page JSON, generating pages programmatically, or driving the builder from an agent/automation without going through the browser UI.
