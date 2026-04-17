/* Handles bulk row additions to a table wrapper and captures undo history */

import { Canvas } from '../../canvas/Canvas';
import { CreateTableRow } from './TableRowFactory';

/* Appends `count` new rows to the table wrapper, reusing the column count of the first row */
export function AddRows(
  tableWrapper: HTMLElement,
  tableId: string,
  count: number = 1
): void {
  const tableRows = tableWrapper.children;
  const existingRowCount = tableRows.length;

  /* Default to 1 column when the table has no existing rows */
  let cellCount = 1;
  if (existingRowCount > 0) {
    cellCount = tableRows[0].children.length;
  }

  for (let i = 0; i < count; i++) {
    /* Row index must be globally unique within the table to keep IDs stable */
    const newRowIndex = existingRowCount + i;
    const row = CreateTableRow(newRowIndex, cellCount, tableId);
    tableWrapper.appendChild(row);
  }

  /* Capture the new state so the action can be undone */
  Canvas.historyManager.captureState();
}
