import { DeviceManager } from './deviceManager';
export declare class DroppableManager {
  private element;
  private deviceManager;
  private onDropCallback?;
  private acceptedTypes;
  constructor(element: HTMLElement, deviceManager: DeviceManager);
  private initializeDroppable;
  setAcceptedTypes(types: string[]): void;
  private onDragOver;
  private onDragLeave;
  private onDrop;
  setOnDrop(callback: (e: DragEvent) => void): void;
  destroy(): void;
}
