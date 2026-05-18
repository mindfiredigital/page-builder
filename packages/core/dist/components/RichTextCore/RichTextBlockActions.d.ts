export declare function applyAlignment(block: HTMLElement, align: string): void;
export declare function extractBlockText(
  content: HTMLElement | null,
  fromType: string
): string;
export declare function injectTextIntoBlock(
  content: HTMLElement,
  toType: string,
  text: string
): void;
export declare function convertBlock(block: HTMLElement, toType: string): void;
export declare function changeHeadingLevel(
  block: HTMLElement,
  level: number
): void;
export declare function toggleImageOption(
  block: HTMLElement,
  option: 'border' | 'stretch' | 'background'
): void;
export declare function toggleCodeTheme(
  block: HTMLElement,
  theme: 'light' | 'dark'
): void;
export declare function toggleListStyle(
  block: HTMLElement,
  style: 'unordered' | 'ordered'
): void;
export declare function moveBlockUp(
  block: HTMLElement,
  root: HTMLElement
): void;
export declare function moveBlockDown(
  block: HTMLElement,
  root: HTMLElement
): void;
export declare function deleteBlock(
  block: HTMLElement,
  root: HTMLElement,
  createBlockFn: (type: string) => HTMLElement
): void;
