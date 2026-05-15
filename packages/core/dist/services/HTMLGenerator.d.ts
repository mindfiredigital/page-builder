import { Canvas } from '../canvas/Canvas';
export declare class HTMLGenerator {
  private readonly canvas;
  private readonly styleElement;
  private readonly styleCollector;
  private readonly svgStamper;
  private readonly sanitizer;
  private readonly shellBuilder;
  constructor(canvas: Canvas);
  generateHTML(): string;
  generateCSS(): string;
  applyCSS(css: string): void;
}
