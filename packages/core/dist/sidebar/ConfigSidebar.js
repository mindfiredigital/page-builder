export class Sidebar {
  constructor(canvas) {
    this.canvas = canvas;
  }
  init() {
    const sidebar = document.getElementById('sidebar');
    sidebar.addEventListener('click', this.onOptionClick.bind(this));
  }
  onOptionClick(event) {
    const target = event.target;
    if (target.classList.contains('config-option')) {
      this.applyConfig(target.dataset.option);
    }
  }
  applyConfig(option) {
    const selectedComponent = document.querySelector('.selected');
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
