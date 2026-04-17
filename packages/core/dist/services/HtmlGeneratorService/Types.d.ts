export interface SVGRecord {
  el: SVGSVGElement;
  prevWidth: string | null;
  prevHeight: string | null;
  prevViewBox: string | null;
  prevStyle: string;
  addedViewBox: boolean;
}
