/* Manages adding and removing individual cells within a table row */
import { CreateTableCell } from './TableRowFactory.js';
/* Appends a new cell to the row that contains the given reference cell */
export function AddCellToRow(referenceCell, tableId) {
  const row = referenceCell.parentElement;
  if (!row) return;
  const rowIndex = Array.from(row.parentElement.children).indexOf(row);
  const currentCellCount = row.children.length;
  /* Scan existing cell IDs to find the highest index and avoid duplicates after deletions */
  let maxCellIndex = -1;
  Array.from(row.querySelectorAll('.table-cell-content')).forEach(el => {
    const match = el.id.match(/-C(\d+)$/);
    if (match) {
      maxCellIndex = Math.max(maxCellIndex, parseInt(match[1], 10));
    }
  });
  /* New cell index is always one above the current maximum */
  const newCellIndex = maxCellIndex + 1;
  const newCell = CreateTableCell(rowIndex, newCellIndex, tableId);
  row.appendChild(newCell);
  /* Update the CSS grid to account for the newly added column */
  row.style.gridTemplateColumns = `repeat(${currentCellCount + 1}, 1fr)`;
}
/* Removes a cell from its row; removes the whole row if the cell was the only one */
export function DeleteCell(cellToDelete) {
  const row = cellToDelete.parentElement;
  if (!row) return;
  const cellCount = row.children.length;
  row.removeChild(cellToDelete);
  if (cellCount === 1) {
    /* Remove the entire row when the last cell is deleted, unless it is the only row */
    const tableWrapper = row.parentElement;
    if (tableWrapper && tableWrapper.children.length > 1) {
      tableWrapper.removeChild(row);
    }
  } else {
    /* Shrink the grid template to reflect the removed column */
    row.style.gridTemplateColumns = `repeat(${cellCount - 1}, 1fr)`;
  }
}
