// utils/GridManager.ts
export class GridManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.gridSize = 20;
    this.isEnabled = false;
    this.overlay = this.createGridOverlay();
  }
  createGridOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'grid-overlay';
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        display: none;
        background-image: linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
        background-size: ${this.gridSize}px ${this.gridSize}px;
      `;
    this.canvas.appendChild(overlay);
    return overlay;
  }
  setGridSize(size) {
    this.gridSize = size;
    this.overlay.style.backgroundSize = `${size}px ${size}px`;
  }
  enable() {
    this.isEnabled = true;
    this.overlay.style.display = 'block';
  }
  disable() {
    this.isEnabled = false;
    this.overlay.style.display = 'none';
  }
  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }
  snapToGrid(x, y) {
    if (!this.isEnabled) return { x, y };
    return {
      x: Math.round(x / this.gridSize) * this.gridSize,
      y: Math.round(y / this.gridSize) * this.gridSize,
    };
  }
  destroy() {
    this.overlay.remove();
  }
}
