export declare class CanvasEventDispatcher {
  static dispatchDesignChange(): void;
  static attachTableDesignListener(): void;
  static attachDropListeners(onDrop: (event: DragEvent) => void): void;
  static attachClickListeners(
    onSelectElement: (target: HTMLElement) => void
  ): void;
}
