/* ─── SvgStamper ──────────────────────────────────────────────────────────────
   Handles the two-phase SVG dimension workflow:
     1. Stamp  — reads each SVG's live bounding rect and writes explicit width,
                 height, viewBox, and inline style attributes so that the cloned
                 DOM carries exact pixel dimensions into the exported HTML.
     2. Restore — reverts every attribute change on the original live SVG nodes
                  so the editor canvas is left in its original state.
   ─────────────────────────────────────────────────────────────────────────── */
export class SvgStamper {
    /* ─── StampSVGDimensions ────────────────────────────────────────────────────
       Iterates all <svg> elements inside the canvas, records their current
       attributes, then overwrites them with measured pixel values. Returns an
       array of SVGRecord snapshots used by RestoreSVGStamps to undo the changes.
       ─────────────────────────────────────────────────────────────────────────── */
    stampSVGDimensions(canvas) {
        const records = [];
        canvas.querySelectorAll('svg').forEach(svg => {
            var _a;
            const rect = svg.getBoundingClientRect();
            if (rect.width === 0)
                return;
            const w = Math.round(rect.width);
            const h = Math.round(rect.height);
            const prevWidth = svg.getAttribute('width');
            const prevHeight = svg.getAttribute('height');
            const prevViewBox = svg.getAttribute('viewBox');
            const prevStyle = (_a = svg.getAttribute('style')) !== null && _a !== void 0 ? _a : '';
            const addedViewBox = !prevViewBox && w > 0 && h > 0;
            svg.setAttribute('width', String(w));
            svg.setAttribute('height', String(h));
            if (addedViewBox)
                svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
            const computed = window.getComputedStyle(svg);
            const disp = computed.getPropertyValue('display');
            /* Build inline style extras that lock the dimensions in the preview */
            const styleExtras = [`width: ${w}px`, `height: ${h}px`, `flex-shrink: 0`];
            if (disp && disp !== 'inline')
                styleExtras.push(`display: ${disp}`);
            const base = prevStyle
                ? prevStyle.trimEnd().replace(/;?\s*$/, ';') + ' '
                : '';
            svg.setAttribute('style', base + styleExtras.join('; ') + ';');
            records.push({
                el: svg,
                prevWidth,
                prevHeight,
                prevViewBox,
                prevStyle,
                addedViewBox,
            });
        });
        return records;
    }
    /* ─── RestoreSVGStamps ──────────────────────────────────────────────────────
       Takes the SVGRecord snapshots produced by StampSVGDimensions and restores
       every attribute to its pre-stamp state, leaving the live editor unchanged.
       ─────────────────────────────────────────────────────────────────────────── */
    restoreSVGStamps(records) {
        records.forEach(({ el, prevWidth, prevHeight, prevViewBox, prevStyle, addedViewBox }) => {
            if (prevWidth !== null) {
                el.setAttribute('width', prevWidth);
            }
            else {
                el.removeAttribute('width');
            }
            if (prevHeight !== null) {
                el.setAttribute('height', prevHeight);
            }
            else {
                el.removeAttribute('height');
            }
            if (addedViewBox) {
                el.removeAttribute('viewBox');
            }
            else if (prevViewBox !== null) {
                el.setAttribute('viewBox', prevViewBox);
            }
            if (prevStyle)
                el.setAttribute('style', prevStyle);
            else
                el.removeAttribute('style');
        });
    }
}
