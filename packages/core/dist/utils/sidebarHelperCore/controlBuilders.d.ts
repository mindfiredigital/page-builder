export declare function rgbToHex(rgb: string): string;
export declare function createControl(label: string, id: string, type: string, value: string | number, controlsContainer: HTMLElement, attributes?: Record<string, string | number>): void;
export declare function createSelectControl(label: string, id: string, currentValue: string, options: string[], controlsContainer: HTMLElement): void;
export declare function createSpacingControl(label: string, id: string, mode: 'all' | 'custom', allValue: number, allUnit: string, sides: {
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
