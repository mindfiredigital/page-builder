import { ModalComponent } from './ModalManager';
export declare class TableComponent {
  static tableAttributeConfig: ComponentAttribute[];
  private modalComponent;
  constructor();
  create(
    rowCount: number,
    columnCount: number,
    isPreview: boolean | undefined,
    tableAttributeConfig: ComponentAttribute[] | undefined | [] | null
  ): HTMLElement;
  evaluateRowVisibility(
    inputValues: Record<string, any>,
    table?: HTMLElement
  ): void;
  private evaluateRule;
  private createTableRow;
  private createTableCell;
  private addCellToRow;
  private deleteCell;
  private styleButton;
  seedFormulaValues(values: Record<string, any>): void;
  updateInputValues(values: Record<string, any>): void;
  updateCellContent(cell: HTMLElement, attribute: ComponentAttribute): void;
  setModalComponent(modalComponent: ModalComponent): void;
  addRow(tableWrapper: HTMLElement, tableId: string): void;
  private static getDefaultValuesOfInput;
  static restore(container: HTMLElement, editable: boolean | null): void;
}
