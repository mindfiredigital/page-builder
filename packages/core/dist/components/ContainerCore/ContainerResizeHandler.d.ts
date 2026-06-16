export declare class ContainerResizeHandler {
    private element;
    private resizersEl;
    private originalWidth;
    private originalHeight;
    private originalX;
    private originalY;
    private originalMouseX;
    private originalMouseY;
    private currentResizer;
    constructor(element: HTMLElement, resizersEl: HTMLElement);
    addResizeHandles(): void;
    private initResize;
    private resize;
    private stopResize;
}
