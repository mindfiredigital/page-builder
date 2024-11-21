import { DeviceManager } from './deviceManager';
import { GridManager } from './gridManager';
export declare class DraggableManager {
  private element;
  private deviceManager;
  private gridManager?;
  private isDragging;
  private initialX;
  private initialY;
  private initialWidth;
  private initialHeight;
  constructor(
    element: HTMLElement,
    deviceManager: DeviceManager,
    gridManager?: GridManager | undefined
  );
  private initializeDraggable;
  private onMouseDown;
  private onTouchStart;
  private startDrag;
  private onMouseMove;
  private onTouchMove;
  private updatePosition;
  private onMouseUp;
  private onTouchEnd;
  private endDrag;
  destroy(): void;
}
