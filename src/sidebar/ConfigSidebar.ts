import { Canvas } from '../canvas/Canvas';

export class Sidebar {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  init() {
    const sidebar = document.getElementById('sidebar')!;
    sidebar.addEventListener('click', this.onOptionClick.bind(this));
  }

  onOptionClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('config-option')) {
      this.applyConfig(target.dataset.option!);
    }
  }

  private applyConfig(option: string) {
    const selectedComponent = document.querySelector(
      '.selected'
    ) as HTMLElement;
    if (selectedComponent) {
      switch (option) {
        case 'color':
          selectedComponent.style.color = 'blue';
          break;
        case 'padding':
          selectedComponent.style.padding = '10px';
          break;
      }
    }
  }
}
