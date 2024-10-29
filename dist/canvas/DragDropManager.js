export class DragDropManager {
  constructor(canvas, sidebar) {
    this.canvas = canvas;
    this.sidebar = sidebar;
  }
  enable() {
    // Select all `.draggable` items in the sidebar
    const draggableItems = this.sidebar.querySelectorAll('.draggable');
    draggableItems.forEach(item => {
      item.addEventListener('dragstart', event => {
        var _a;
        const dragEvent = event;
        console.log(`Dragging component: ${item.id}`); // Debug log
        (_a = dragEvent.dataTransfer) === null || _a === void 0
          ? void 0
          : _a.setData('component-type', item.id);
      });
    });
  }
}
