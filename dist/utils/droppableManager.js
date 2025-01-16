export class DroppableManager {
  constructor(element, deviceManager) {
    this.element = element;
    this.deviceManager = deviceManager;
    this.acceptedTypes = [];
    this.initializeDroppable();
  }
  initializeDroppable() {
    this.element.addEventListener('dragover', this.onDragOver.bind(this));
    this.element.addEventListener('drop', this.onDrop.bind(this));
    this.element.addEventListener('dragleave', this.onDragLeave.bind(this));
  }
  setAcceptedTypes(types) {
    this.acceptedTypes = types;
  }
  onDragOver(e) {
    var _a;
    e.preventDefault();
    const componentType =
      (_a = e.dataTransfer) === null || _a === void 0
        ? void 0
        : _a.getData('component-type');
    if (
      this.acceptedTypes.length === 0 ||
      (componentType && this.acceptedTypes.includes(componentType))
    ) {
      e.dataTransfer.dropEffect = 'move';
      this.element.classList.add('droppable-hover');
    }
  }
  onDragLeave(e) {
    this.element.classList.remove('droppable-hover');
  }
  onDrop(e) {
    e.preventDefault();
    this.element.classList.remove('droppable-hover');
    if (this.onDropCallback) {
      this.onDropCallback(e);
    }
  }
  setOnDrop(callback) {
    this.onDropCallback = callback;
  }
  destroy() {
    this.element.removeEventListener('dragover', this.onDragOver.bind(this));
    this.element.removeEventListener('drop', this.onDrop.bind(this));
    this.element.removeEventListener('dragleave', this.onDragLeave.bind(this));
  }
}
