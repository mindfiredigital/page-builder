import { Canvas } from '../canvas/Canvas';
export declare class HTMLGenerator {
  private canvas;
  private styleElement;
  constructor(canvas: Canvas);
  generateHTML(): string;
  private getBaseHTML;
  private cleanupElements;
  generateCSS(): string;
  private handleSVGElement;
  private generateSVGSpecificSelector;
  private generateUniqueSelector;
  applyCSS(css: string): void;
}
