export declare class TableComponent {
  create(
    rowCount: number,
    columnCount: number,
    isPreview?: boolean
  ): HTMLElement;
  addRow(table: HTMLTableElement): void;
  addColumn(table: HTMLTableElement): void;
  /**
   * Sets the total number of rows in the table. Adds or removes rows as needed.
   * Preserves existing content where possible.
   * @param table The HTMLTableElement to modify.
   * @param targetRowCount The desired total number of rows.
   */
  setRowCount(table: HTMLTableElement, targetRowCount: number): void;
  /**
   * Sets the total number of columns in the table. Adds or removes columns as needed.
   * Preserves existing content where possible.
   * @param table The HTMLTableElement to modify.
   * @param targetColumnCount The desired total number of columns.
   */
  setColumnCount(table: HTMLTableElement, targetColumnCount: number): void;
  /**
   * Converts the first row of a table into a header row.
   *
   * This function takes an HTML table element as input and modifies its first row.
   * It replaces each `<td>` element in the first row with a `<th>` element,
   * preserving the content and attributes of the original `<td>` elements.
   *
   * @param table The HTMLTableElement to modify.
   * @returns void
   */
  createHeder(table: HTMLTableElement): void;
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
