import { Canvas } from '../canvas/Canvas.js';
import {
  injectResizerStyles,
  ContainerResizeHandler,
  initContainerEventListeners,
  restoreContainer,
} from './ContainerCore/index.js';
export class ContainerComponent {
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('container-component');
    /* Wrapper that holds the four corner resize handles */
    this.resizers = document.createElement('div');
    this.resizers.classList.add('resizers');
    this.element.appendChild(this.resizers);
    /* Resize handles are only needed in absolute layout mode */
    if (Canvas.layoutMode === 'absolute') {
      const resizeHandler = new ContainerResizeHandler(
        this.element,
        this.resizers
      );
      resizeHandler.addResizeHandles();
    }
    /* Inject corner-handle CSS into <head> */
    injectResizerStyles();
    /* Bind drag/drop and hover events onto the element */
    initContainerEventListeners(this.element);
  }
  /* Returns the root DOM element for insertion into the canvas */
  create() {
    return this.element;
  }
  /* Re-attaches interactivity to a container loaded from saved state */
  static restoreContainer(container, editable) {
    restoreContainer(container, editable);
  }
}
