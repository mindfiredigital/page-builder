export class DragDropManager {
  private canvas: HTMLElement;
  private sidebar: HTMLElement;

  constructor(canvas: HTMLElement, sidebar: HTMLElement) {
    this.canvas = canvas;
    this.sidebar = sidebar;
  }

  enable() {
    // Select all `.draggable` items in the sidebar
    const draggableItems = this.sidebar.querySelectorAll('.draggable');
    draggableItems.forEach(item => {
      item.addEventListener('dragstart', event => {
        const dragEvent = event as DragEvent;
        console.log(`Dragging component: ${item.id}`); // Debug log
        dragEvent.dataTransfer?.setData('component-type', item.id);
      });
    });
  }
}
