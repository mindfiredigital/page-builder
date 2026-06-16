export declare class CanvasEventDispatcher {
    private static _designChangeTimer;
    static dispatchDesignChange(): void;
    static attachTableDesignListener(): void;
    static attachDropListeners(onDrop: (event: DragEvent) => void): void;
    static attachClickListeners(onSelectElement: (target: HTMLElement) => void): void;
}
