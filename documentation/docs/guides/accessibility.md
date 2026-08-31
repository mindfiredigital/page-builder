---
sidebar_position: 2
---

# Accessibility

Page Builder is a tool for building pages — the pages it produces are only as accessible as the content and configuration you give it. This guide covers what the builder does for you today, and what you still need to handle yourself.

## What the editor UI supports today

- **Keyboard shortcuts**: `Ctrl/Cmd+Z` (undo), `Ctrl/Cmd+Y` (redo), and a scoped `Ctrl/Cmd+A` (select-all) that respects the nearest editable container instead of selecting the whole page.
- **`aria-label`s on transient controls**: mobile drawer/FAB controls (the panel toggles shown on small viewports) carry `aria-label`s describing their action.

## Known gaps — handle these yourself for now

- **Image `alt` text**: the built-in Image component does not currently expose an `alt` text field. If you need accessible images, use a [custom component](../configuration/features/custom-components.md) for images until first-class `alt` support ships, or post-process the exported design's image blocks to inject `alt` attributes before publishing.
- **Focus management in modals**: the export/preview modals do not currently trap or restore focus automatically — verify this manually if you rely on screen-reader or keyboard-only navigation through those flows.
- **Color contrast**: default component styles are a starting point, not a WCAG-AA guarantee. Check contrast on any text/background color combination you configure via the styling controls.
- **Generated semantic structure**: exported HTML uses generic containers (`div`) for most block types rather than semantic elements (`<header>`, `<nav>`, `<main>`, etc.) — add semantic wrapping in your own consuming app if that matters for your use case.

## Recommendations for consumers

1. Treat the builder's output as a starting point, then run it through an automated checker (e.g. [axe](https://www.deque.com/axe/), Lighthouse) before shipping.
2. Prefer semantic custom components over the generic `container`/`text` blocks where structure matters (headings, landmarks, lists).
3. Always set meaningful text content — avoid icon-only buttons/links without an accompanying accessible label.

This guide will be kept up to date as first-class accessibility features (starting with image `alt` text) land — see the project's [contribution guide](../contributors/how-to-contribute.md) if you'd like to help close one of the gaps above.
