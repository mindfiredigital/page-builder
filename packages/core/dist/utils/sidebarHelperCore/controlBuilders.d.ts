export declare function rgbToHex(rgb: string): string;
export declare function createControl(
  label: string,
  id: string,
  type: string,
  value: string | number,
  controlsContainer: HTMLElement,
  attributes?: Record<string, string | number>
): void;
export declare function createSelectControl(
  label: string,
  id: string,
  currentValue: string,
  options: string[],
  controlsContainer: HTMLElement
): void;
