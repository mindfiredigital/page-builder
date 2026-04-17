/* ─── SVGRecord ───────────────────────────────────────────────────────────────
   Snapshot of an SVG element's original attributes before dimension-stamping.
   Used to restore the live DOM after cloning the canvas for export.
   ─────────────────────────────────────────────────────────────────────────── */
export interface SVGRecord {
  el: SVGSVGElement;
  prevWidth: string | null;
  prevHeight: string | null;
  prevViewBox: string | null;
  prevStyle: string;
  addedViewBox: boolean;
}
