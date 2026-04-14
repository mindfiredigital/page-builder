import { Canvas } from '../canvas/Canvas';
export declare class HTMLGenerator {
  private canvas;
  private readonly styleElement;
  constructor(canvas: Canvas);
  generateHTML(): string;
  private collectHeadStyles;
  private stampSVGDimensions;
  private restoreSVGStamps;
  private stripEditorChrome;
  private stripNodeRecursive;
  private buildHTMLShell;
  generateCSS(): string;
  private handleSVGElement;
  private generateSVGSpecificSelector;
  private generateUniqueSelector;
  applyCSS(css: string): void;
}
