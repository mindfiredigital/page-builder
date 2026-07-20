import { CANVAS } from '../schema.js';

export function buildHarnessPage(): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>pagebuilder serve</title>
<link rel="stylesheet" href="/bundle.css" />
<style>
  #pb-status {
    padding: 6px 12px;
    background: #111;
    color: #0f0;
    font-family: monospace;
    font-size: 12px;
  }

  /* core's own CSS caps #canvas.preview-printable at max-width: 869px (a
     "print preview" simulation width) — deliberately *responsive*, so the
     editor's own general-purpose UI can shrink on a narrow browser window.
     pagectl bakes "preview-printable" onto every canvas root (to fix an
     unrelated "flips to grid on live edit" bug — see
     ABSOLUTE_CANVAS_CLASSES in schema.ts), which inadvertently invokes
     this responsive cap. But pagectl's entire coordinate system is FIXED,
     not responsive — every x/y/width in the page's JSON assumes a canvas
     that is always exactly CANVAS.width x CANVAS.height, the same way a
     design tool's canvas has a fixed size regardless of window size. Using
     max-width here (as a first attempt) still let the canvas render
     narrower than CANVAS.width on a smaller browser window, which put
     every already-correct absolute position past the real (shrunk) right
     edge — confirmed live with Playwright at a narrower viewport. A fixed
     width (not max-width) forces it to always be exactly CANVAS.width;
     #canvas itself already has overflow: auto (both axes), so a window too
     narrow to show the full canvas just gets a horizontal scrollbar,
     matching how any fixed-size design canvas behaves — never a resize of
     the coordinate system itself. Scoped to .preview-desktop specifically
     (not .preview-tablet/.preview-mobile, both out of pagectl v1's scope)
     so a manual tablet/mobile preview toggle in the UI isn't fought.

     width alone isn't enough: #canvas's own base rule (bundle.css) sets
     flex-grow: 1 — a flex item's width property only sets its flex-basis,
     and flex-grow then adds any remaining free space in the flex row ON
     TOP of that regardless of !important, since !important on a property
     only wins against other declarations of that same property, not
     against the flex algorithm consuming the value afterward. Confirmed
     live: with only width overridden, the canvas still rendered at
     whatever the flex row's available space was (1695px / 1030px at two
     different window widths), never CANVAS.width. flex-grow/flex-shrink: 0
     stops it from growing or shrinking away from the fixed width at all. */
  #canvas.preview-printable.preview-desktop {
    width: ${CANVAS.width}px !important;
    max-width: none !important;
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
  }

  /* Fallout of pinning #canvas above: #sidebar/#customization already
     have flex-shrink: 0 of their own (core's base CSS), and now #canvas
     does too — so when the sidebar + fixed CANVAS.width canvas + open
     customization panel (205 + ${CANVAS.width} + 300 = ${205 + CANVAS.width + 300}px) exceeds the actual
     browser window width, nothing in the row is allowed to shrink and
     #app's own overflow: hidden (core's base CSS, used to clip children to
     its rounded corners) silently clips whatever doesn't fit — with no
     way to scroll to it. Confirmed live: at a 1500px window with the
     settings panel open, #app.scrollWidth (1706px) exceeded its
     clientWidth (1500px) by ~206px, and that entire slice of the settings
     panel was genuinely unreachable, not just off-screen. overflow-x here
     (not the overflow shorthand, so overflow-y stays hidden and rounded
     corners still clip vertically) makes that slice reachable by
     horizontal scroll instead of invisible. */
  #app {
    overflow-x: auto !important;
  }

  /* Every real consumer of <page-builder> must size it explicitly — it's a
     custom element with no default height, so left unstyled it grows to
     its full content height instead of filling the viewport. Without this,
     html/body's own "overflow: hidden" (core's own app-shell CSS) just
     clips whatever overflows past the viewport with no way to scroll to
     it, because the intended scroll target — #canvas's "overflow: auto"
     inside the component — never gets squeezed by a bounded ancestor in
     the first place. Mirrors packages/example/test-react/src/index.css's
     "page-builder { flex: 1; min-height: 0; ... }", the documented pattern
     every other consumer already applies to this component. */
  html,
  body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  body {
    display: flex;
    flex-direction: column;
  }

  page-builder {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
</style>
</head>
<body>
<div id="pb-status">connecting...</div>
<page-builder id="pb"></page-builder>
<script src="/bundle.js"></script>
<script>
  const pb = document.getElementById('pb');
  const statusEl = document.getElementById('pb-status');

  // layoutMode is a JS property, not an HTML attribute, and the underlying
  // PageBuilder core defaults to 'grid' when it's left unset — which
  // silently breaks pagectl's absolute x/y positions in the live preview.
  // pagectl v1 is absolute-mode only; pin it before anything initializes.
  pb.layoutMode = 'absolute';

  fetch('/design')
    .then(r => r.json())
    .then(design => {
      pb.initialDesign = design;
      pb.configData = { Basic: [], Extra: [], Custom: [] };
    });

  const source = new EventSource('/events');
  source.onopen = () => (statusEl.textContent = 'live — connected to sidecar');
  source.onmessage = event => {
    const design = JSON.parse(event.data);
    if (pb.generateOutput) {
      try {
        pb.applyDesign(design);
      } catch {
        /* not initialized yet — fall back to (re)setting initialDesign */
        pb.initialDesign = design;
        pb.configData = { Basic: [], Extra: [], Custom: [] };
      }
    }
    statusEl.textContent = 'updated at ' + new Date().toLocaleTimeString();
  };
  source.onerror = () => (statusEl.textContent = 'disconnected from sidecar');
</script>
</body>
</html>`;
}
