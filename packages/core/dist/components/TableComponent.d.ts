export declare class TableComponent {
  create(
    rowCount: number,
    columnCount: number,
    isPreview?: boolean
  ): HTMLElement;
  addRow(table: HTMLTableElement): void;
  addColumn(table: HTMLTableElement): void;
}
