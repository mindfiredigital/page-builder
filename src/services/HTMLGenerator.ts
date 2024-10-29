import { Canvas } from '../canvas/Canvas';

export class HTMLGenerator {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  generateHTML(): string {
    return document.getElementById('canvas')?.innerHTML || '';
  }
}
