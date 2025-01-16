export class DraggableManager {
  constructor(element, deviceManager, gridManager) {
    this.element = element;
    this.deviceManager = deviceManager;
    this.gridManager = gridManager;
    this.isDragging = false;
    this.initialX = 0;
    this.initialY = 0;
    this.initialWidth = 0;
    this.initialHeight = 0;
    this.initializeDraggable();
  }
  initializeDraggable() {
    this.element.style.position = 'absolute';
    this.element.style.cursor = 'move';
    this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.element.addEventListener('touchstart', this.onTouchStart.bind(this));
    document.addEventListener('touchmove', this.onTouchMove.bind(this));
    document.addEventListener('touchend', this.onTouchEnd.bind(this));
  }
  onMouseDown(e) {
    this.startDrag(e.clientX, e.clientY);
  }
  onTouchStart(e) {
    const touch = e.touches[0];
    this.startDrag(touch.clientX, touch.clientY);
  }
  startDrag(clientX, clientY) {
    this.isDragging = true;
    const rect = this.element.getBoundingClientRect();
    this.initialX = clientX - rect.left;
    this.initialY = clientY - rect.top;
    this.initialWidth = rect.width;
    this.initialHeight = rect.height;
    this.element.style.cursor = 'grabbing';
  }
  onMouseMove(e) {
    if (this.isDragging) {
      this.updatePosition(e.clientX, e.clientY);
    }
  }
  onTouchMove(e) {
    if (this.isDragging) {
      const touch = e.touches[0];
      this.updatePosition(touch.clientX, touch.clientY);
    }
  }
  updatePosition(clientX, clientY) {
    const parentRect = this.element.parentElement.getBoundingClientRect();
    let newX = clientX - parentRect.left - this.initialX;
    let newY = clientY - parentRect.top - this.initialY;
    // Apply grid snapping if available
    if (this.gridManager) {
      const snappedPosition = this.gridManager.snapToGrid(newX, newY);
      newX = snappedPosition.x;
      newY = snappedPosition.y;
    }
    // Boundary checks
    newX = Math.max(0, Math.min(newX, parentRect.width - this.initialWidth));
    newY = Math.max(0, Math.min(newY, parentRect.height - this.initialHeight));
    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;
    // Update position in DeviceManager
    this.deviceManager.setComponentStyle(
      this.element.classList[0],
      this.deviceManager.getCurrentDevice(),
      {},
      {
        x: newX,
        y: newY,
        width: this.initialWidth,
        height: this.initialHeight,
      }
    );
  }
  onMouseUp() {
    this.endDrag();
  }
  onTouchEnd() {
    this.endDrag();
  }
  endDrag() {
    if (this.isDragging) {
      this.isDragging = false;
      this.element.style.cursor = 'move';
    }
  }
  destroy() {
    this.element.removeEventListener('mousedown', this.onMouseDown.bind(this));
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.element.removeEventListener(
      'touchstart',
      this.onTouchStart.bind(this)
    );
    document.removeEventListener('touchmove', this.onTouchMove.bind(this));
    document.removeEventListener('touchend', this.onTouchEnd.bind(this));
  }
}
