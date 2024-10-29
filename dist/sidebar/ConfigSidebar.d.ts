import { Canvas } from '../canvas/Canvas';
export declare class Sidebar {
  private canvas;
  constructor(canvas: Canvas);
  init(): void;
  onOptionClick(event: MouseEvent): void;
  private applyConfig;
}
