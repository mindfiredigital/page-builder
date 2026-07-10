/** Builds and registers all supported component types */
export declare class CanvasComponentFactory {
    private static readonly TYPE_ALIASES;
    /** Lazy factory map — each entry calls create() on demand */
    private static get factoryMap();
    /** Instantiates a component by type; returns null for unknown types */
    static createComponent(type: string, customSettings?: string | null, props?: string): HTMLElement | null;
    /** Generates a collision-free id like "button3" within the current components list */
    static generateUniqueClass(type: string, isContainerComponent?: boolean, containerClass?: string | null): string;
}
