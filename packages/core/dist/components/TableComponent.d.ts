import { ModalComponent } from './ModalManager';
export declare class TableComponent {
  private static tableAttributeConfig;
  private modalComponent;
  constructor();
  create(
    rowCount: number,
    columnCount: number,
    isPreview: boolean | undefined,
    tableAttributeConfig: ComponentAttribute[] | undefined | [] | null
  ): HTMLElement;
  private createTableRow;
  private createTableCell;
  private addCellToRow;
  private deleteCell;
  private styleButton;
  handleCellClick(cell: HTMLElement): Promise<void>;
  private findSelectedAttribute;
  seedFormulaValues(table: HTMLElement, values: Record<string, any>): void;
  private updateCellContent;
  setModalComponent(modalComponent: ModalComponent): void;
  addRow(tableWrapper: HTMLElement, tableId: string): void;
  static restore(container: HTMLElement, editable: boolean | null): void;
}
