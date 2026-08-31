/** Serialises and deserialises the canvas DOM into/from PageBuilderDesign */
export declare class CanvasStateManager {
    static isRestoring: boolean;
    /** Capture a full snapshot of the canvas and every component on it */
    static getState(): PageBuilderDesign;
    /** Rehydrate the canvas DOM from a previously captured PageBuilderDesign */
    static restoreState(state: PageBuilderDesign): void;
}
