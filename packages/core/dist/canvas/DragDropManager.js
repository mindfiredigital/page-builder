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
        var _a, _b;
        const dragEvent = event;
        console.log(`Dragging component: ${item.id}`); // Debug log
        (_a = dragEvent.dataTransfer) === null || _a === void 0
          ? void 0
          : _a.setData('component-type', item.id);
        const settingsData = item.getAttribute('data-component-settings');
        if (settingsData) {
          (_b = dragEvent.dataTransfer) === null || _b === void 0
            ? void 0
            : _b.setData('custom-settings', settingsData);
          console.log(
            `Setting custom settings from DOM:`,
            JSON.parse(settingsData)
          );
        }
      });
    });
  }
}
