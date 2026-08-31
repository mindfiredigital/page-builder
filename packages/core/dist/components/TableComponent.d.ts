import { ModalComponent } from './ModalManager';
export declare class TableComponent {
    static tableAttributeConfig: ComponentAttribute[];
    private modalComponent;
    constructor();
    create(rowCount: number, columnCount: number, isPreview: boolean | undefined, tableAttributeConfig: ComponentAttribute[] | undefined | [] | null): HTMLElement;
    evaluateRowVisibility(values: AttributeValues, table?: HTMLElement): void;
    seedFormulaValues(values: AttributeValues): void;
    updateInputValues(values: AttributeValues): void;
    updateCellContent(cell: HTMLElement, attribute: ComponentAttribute): void;
    addRows(tableWrapper: HTMLElement, tableId: string, count?: number): void;
    setModalComponent(modalComponent: ModalComponent): void;
    static restore(container: HTMLElement, editable: boolean | null): void;
}
