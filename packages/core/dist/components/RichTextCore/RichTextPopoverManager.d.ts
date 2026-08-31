export declare class RichTextPopoverManager {
    private root;
    private generateBlockId;
    private activePopover;
    private activeBlock;
    private activeSubmenu;
    private submenuHideTimer;
    constructor(root: HTMLElement, generateBlockId: () => string);
    /** Attaches the document-level click handler that closes open popovers. */
    init(): void;
    createBlock(type: string): HTMLElement;
    private buildAddPopover;
    toggleAddPopover(block: HTMLElement, anchor: HTMLElement): void;
    hidePopover(): void;
    insertBlock(type: string, afterBlock: HTMLElement): void;
    toggleTunePopover(block: HTMLElement, anchor: HTMLElement): void;
    private buildTunePopover;
    showSubmenu(items: TuneItem[], anchor: HTMLElement): void;
    hideSubmenuNow(): void;
    scheduleHideSubmenu(): void;
    cancelHideSubmenu(): void;
    private makeTuneItemCallbacks;
    private makeTuneActions;
}
