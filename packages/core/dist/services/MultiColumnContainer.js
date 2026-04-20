import { Canvas } from '../canvas/Canvas.js';
import { ContainerComponent } from '../components/ContainerComponent.js';
import { ImageComponent } from '../components/ImageComponent.js';
export class MultiColumnContainer {
  constructor(columnCount, className = `${columnCount}Col-component`) {
    this.columnCount = columnCount;
    this.element = document.createElement('div');
    this.element.classList.add(className);
    this.element.setAttribute('draggable', 'true');
    for (let i = 1; i <= columnCount; i++) {
      const column = this.createColumn(`column-${i}`);
      this.element.appendChild(column);
    }
    this.addStyles(className);
    this.initializeEventListeners();
  }
  createColumn(className) {
    const column = document.createElement('div');
    column.classList.add('column', className);
    column.setAttribute('draggable', 'true');
    column.style.width = `${100 / this.columnCount}%`;
    const parentId = this.element.id;
    column.id = `${this.columnCount}Col-component${parentId}-${className}`;
    return column;
  }
  initializeEventListeners() {
    this.element.addEventListener('dragover', event => event.preventDefault());
    this.element.addEventListener('drop', this.onDrop.bind(this));
  }
  onDrop(event) {
    var _a;
    event.preventDefault();
    event.stopPropagation();
    const componentType =
      (_a = event.dataTransfer) === null || _a === void 0
        ? void 0
        : _a.getData('component-type');
    if (!componentType) return;
    const component = Canvas.createComponent(componentType);
    if (!component) return;
    const targetColumn = event.target;
    if (targetColumn && targetColumn.classList.contains('column')) {
      targetColumn.appendChild(component);
      const parentId = this.element.id;
      const columnIndex = Array.from(
        targetColumn.parentElement.children
      ).indexOf(targetColumn);
      const columnSuffix = `c${columnIndex}`;
      const newColumnClassName = `${parentId}-${columnSuffix}`;
      targetColumn.id = newColumnClassName;
      targetColumn.classList.add(newColumnClassName);
      let columnLabel = targetColumn.querySelector('.column-label');
      if (!columnLabel) {
        columnLabel = document.createElement('span');
        columnLabel.className = 'column-label';
        targetColumn.appendChild(columnLabel);
      }
      columnLabel.textContent = newColumnClassName;
      const uniqueComponentClass = Canvas.generateUniqueClass(
        componentType,
        true,
        newColumnClassName
      );
      component.classList.add(uniqueComponentClass);
      component.id = uniqueComponentClass;
      let componentLabel = component.querySelector('.component-label');
      if (!componentLabel) {
        componentLabel = document.createElement('span');
        componentLabel.className = 'component-label';
        componentLabel.setAttribute('contenteditable', 'false');
        component.appendChild(componentLabel);
      }
      componentLabel.textContent = uniqueComponentClass;
      Canvas.historyManager.captureState();
    }
  }
  addStyles(className) {
    const style = document.createElement('style');
    style.textContent = `
      .${className} {
        display: flex;
        min-width: 100px;
        min-height: 100px;
      }
      .column {
        flex-grow: 1;
        min-width: 50px;
        border: 1px dashed #ddd;
        position: relative;
      }
      .column:hover {
        outline: 1px solid #3498db;
        background: #f5f5f5;
      }
    `;
    document.head.appendChild(style);
  }
  create() {
    return this.element;
  }
  static restoreColumn(column) {
    const columnChildren = column.querySelectorAll('.editable-component');
    columnChildren.forEach(child => {
      var _a, _b;
      const childElement = child;
      Canvas.controlsManager.addControlButtons(childElement);
      Canvas.addDraggableListeners(childElement);
      if (childElement.classList.contains('image-component')) {
        const imageSrc =
          (_b =
            (_a = childElement.querySelector('img')) === null || _a === void 0
              ? void 0
              : _a.getAttribute('src')) !== null && _b !== void 0
            ? _b
            : null;
        ImageComponent.restoreImageUpload(
          childElement,
          imageSrc !== null && imageSrc !== void 0 ? imageSrc : '',
          null
        );
      }
      if (childElement.classList.contains('container-component')) {
        ContainerComponent.restoreContainer(childElement);
      }
    });
  }
}
