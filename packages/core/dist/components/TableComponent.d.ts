export declare class TableComponent {
  create(
    rowCount: number,
    columnCount: number,
    isPreview?: boolean
  ): HTMLElement;
  addRow(table: HTMLTableElement): void;
  addColumn(table: HTMLTableElement): void;
  /**
   * This method helps to restore the functionality of the buttons present within
   * table component container
   * This method comes to handy when you need to restore the saved page or doing
   * undo redo frequently.
   * @param container
   * @returns void
   */
  static restore(container: HTMLElement): void;
}
