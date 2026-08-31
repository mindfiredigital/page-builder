import { JSONStorage } from '../services/JSONStorage';
import { HTMLGenerator } from '../services/HTMLGenerator';
import { PreviewPanel } from '../canvas/PreviewPanel';
export declare function setupSaveButton(jsonStorage: JSONStorage): void;
export declare function setupResetButton(jsonStorage: JSONStorage): void;
export declare function setupViewButton(htmlGenerator: HTMLGenerator, layoutMode: 'absolute' | 'grid'): void;
export declare function setupPreviewModeButtons(previewPanel: PreviewPanel): void;
export declare function setupUndoRedoButtons(): void;
