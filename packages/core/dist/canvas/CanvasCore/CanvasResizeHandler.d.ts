export declare class CanvasResizeHandler {
    static isResizing: boolean;
    private element;
    private originalWidth;
    private originalHeight;
    private originalLeft;
    private originalTop;
    private originalMouseX;
    private originalMouseY;
    private currentHandle;
    constructor(element: HTMLElement);
    static restore(element: HTMLElement): void;
    addResizeHandles(): void;
    private initResize;
    private resize;
    private stopResize;
}
