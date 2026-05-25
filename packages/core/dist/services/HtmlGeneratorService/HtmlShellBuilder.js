import { Canvas } from '../../canvas/Canvas.js';
/* ─── HtmlShellBuilder ────────────────────────────────────────────────────────
   Constructs the complete <!DOCTYPE html> document string that wraps the
   exported canvas content. Injects the collected head styles, the generated
   computed-style CSS, and a small alignment-preservation rule for inline
   elements before handing the string back to the caller.
   ─────────────────────────────────────────────────────────────────────────── */
export class HtmlShellBuilder {
  /* ─── Build ─────────────────────────────────────────────────────────────────
       Assembles and returns the full HTML document. The layout class applied to
       the #canvas div switches between grid-layout-active (grid mode) and
       preview-printable (absolute/print mode) to match the editor state.
       ─────────────────────────────────────────────────────────────────────────── */
  build(bodyContent, embeddedStyles, generatedCSS) {
    const layoutClass =
      Canvas.layoutMode === 'grid' ? 'grid-layout-active' : 'preview-printable';
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Builder</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
${this.buildInlineAlignmentRule()}
    </style>
    <style>
${embeddedStyles}
    </style>
    <style>
${generatedCSS}
    </style>
  </head>
  <body>
    <div id="canvas" class="${layoutClass}">
${bodyContent}
    </div>
  </body>
</html>`;
  }
  /* ─── BuildInlineAlignmentRule ──────────────────────────────────────────────
       Returns a CSS snippet that locks the bottom edges of inline and
       inline-block elements to the same baseline. This mirrors the editor's
       shared inline formatting context so that components placed side by side
       (e.g. a header next to a table) do not shift vertically in the preview.
       ─────────────────────────────────────────────────────────────────────────── */
  buildInlineAlignmentRule() {
    return `
      /* Preserve inline element bottom alignment from editor */
      #canvas [style*="display: inline"],
      #canvas [style*="display: inline-block"] {
        vertical-align: bottom;
      }
    `;
  }
}
