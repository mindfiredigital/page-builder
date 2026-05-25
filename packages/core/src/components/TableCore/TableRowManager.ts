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
    /* Use .table-cell count to exclude the insert-row-button from the tally */
    cellCount =
      Array.from(tableRows[0].children).filter(c =>
        c.classList.contains('table-cell')
      ).length || 1;
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

/* Inserts a new row immediately after rowElement, renumbering all rows below it */
export function InsertRowBelow(rowElement: HTMLElement): void {
  const tableWrapper = rowElement.parentElement;
  if (!tableWrapper) return;

  const idMatch = rowElement.id.match(/^table-row-T-(.+)-R(\d+)$/);
  if (!idMatch) return;

  const tableId = idMatch[1];
  const currentIndex = parseInt(idMatch[2]);
  const rows = Array.from(tableWrapper.children) as HTMLElement[];

  /* Shift IDs and default-pattern text of every row after the insertion point up by one */
  for (let i = rows.length - 1; i > currentIndex; i--) {
    const row = rows[i];
    const newIndex = i + 1;
    row.id = `table-row-T-${tableId}-R${newIndex}`;
    row.querySelectorAll('.table-cell-content').forEach((content, j) => {
      const el = content as HTMLElement;
      el.id = `table-cell-T-${tableId}-R${newIndex}-C${j}`;
      /* Only rename the label when the user hasn't edited it yet */
      if (el.textContent === `R${i}C${j}`) {
        el.textContent = `R${newIndex}C${j}`;
      }
    });
  }

  const cellCount = rowElement.querySelectorAll('.table-cell').length;
  const newRow = CreateTableRow(currentIndex + 1, cellCount, tableId);
  rowElement.insertAdjacentElement('afterend', newRow);

  Canvas.historyManager.captureState();
}
