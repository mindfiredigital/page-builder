export declare class SidebarUtils {
    static createPageSizeSelect(container: HTMLElement, canvasElement: HTMLElement): void;
    static createControl(label: string, id: string, type: string, value: string | number, controlsContainer: HTMLElement, attributes?: Record<string, string | number>): void;
    static createSpacingControl(label: string, id: string, mode: 'all' | 'custom', allValue: number, allUnit: string, sides: {
        top: {
            value: number;
            unit: string;
        };
        right: {
            value: number;
            unit: string;
        };
        bottom: {
            value: number;
            unit: string;
        };
        left: {
            value: number;
            unit: string;
        };
    }, controlsContainer: HTMLElement, attributes?: {
        min?: number;
        max?: number;
    }): void;
    static createSelectControl(label: string, id: string, currentValue: string, options: string[], controlsContainer: HTMLElement): void;
    static rgbToHex(rgb: string): string;
    static createAttributeControls(attribute: ComponentAttribute, functionsPanel: HTMLElement, handleInputTrigger: (event: Event) => void): void;
    static populateModalButton(component: HTMLElement, functionsPanel: HTMLElement, editable: boolean | null): void;
    static populateRowVisibilityControls(row: HTMLElement, inputs: ComponentAttribute[]): void;
}
