export declare const PAGE_SIZES: Record<
  string,
  {
    width: number;
    height: number;
  }
>;
export declare const PAGE_SIZES_OPTIONS: {
  value: string;
  label: string;
}[];
export declare function createPageSizeSelect(
  container: HTMLElement,
  canvasElement: HTMLElement
): void;
