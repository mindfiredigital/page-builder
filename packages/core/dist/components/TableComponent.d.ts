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
  /**
   * Handles cell click events to open the modal with table configuration
   * @param cell The clicked table cell element
   */
  private handleCellClick;
  /**
   * Finds the selected attribute based on modal result
   * @param result The result from the modal
   * @returns The selected ComponentAttribute or null
   */
  private findSelectedAttribute;
  /**
   * Updates the cell content based on the selected attribute
   * @param cell The table cell to update
   * @param attribute The selected attribute
   * @param result The modal result
   */
  private updateCellContent;
  /**
   * Sets the modal component for this table instance
   * @param modalComponent The modal component instance
   */
  setModalComponent(modalComponent: ModalComponent): void;
  addRow(table: HTMLTableElement): void;
  addColumn(table: HTMLTableElement): void;
  setRowCount(table: HTMLTableElement, targetRowCount: number): void;
  setColumnCount(table: HTMLTableElement, targetColumnCount: number): void;
  createHeder(table: HTMLTableElement): void;
  static restore(container: HTMLElement): void;
}
