/* Factory functions responsible for creating table row and cell DOM elements */

import { AddCellToRow, DeleteCell } from './TableCellManager';

/* Creates a single table row div with the specified number of cells */
export function CreateTableRow(
  rowIndex: number,
  cellCount: number,
  tableId: string
): HTMLElement {
  const rowDiv = document.createElement('div');
  rowDiv.style.display = 'grid';
  rowDiv.style.gridTemplateColumns = `repeat(${cellCount}, 1fr)`;
  rowDiv.className = 'table-row';
  rowDiv.id = `table-row-T-${tableId}-R${rowIndex}`;
  rowDiv.style.position = 'relative';
  rowDiv.style.cursor = 'pointer';

  for (let j = 0; j < cellCount; j++) {
    const cell = CreateTableCell(rowIndex, j, tableId);
    rowDiv.appendChild(cell);
  }

  return rowDiv;
}

/* Creates a single table cell with editable content and add/delete control buttons */
export function CreateTableCell(
  rowIndex: number,
  cellIndex: number,
  tableId: string
): HTMLElement {
  const cell = document.createElement('div');
  cell.className = 'table-cell';
  cell.style.border = '1px solid #2F3132';
  cell.style.minHeight = '45px';
  cell.style.position = 'relative';
  cell.style.cursor = 'pointer';
  cell.style.transition = 'background-color 0.2s ease';
  cell.style.display = 'flex';
  cell.style.alignItems = 'center';
  cell.style.justifyContent = 'flex-start';

  /* Container for the add / delete buttons anchored to the bottom-right of the cell */
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'cell-controls';
  controlsContainer.style.position = 'absolute';
  controlsContainer.style.bottom = '5px';
  controlsContainer.style.right = '5px';
  controlsContainer.style.display = 'flex';
  controlsContainer.style.gap = '4px';
  controlsContainer.style.alignItems = 'center';
  controlsContainer.style.justifyContent = 'center';
  controlsContainer.contentEditable = 'false';

  /* Editable text span that displays cell content */
  const contentElement = document.createElement('span');
  contentElement.textContent = `R${rowIndex}C${cellIndex}`;
  contentElement.contentEditable = 'true';
  contentElement.classList.add('table-cell-content');
  contentElement.id = `table-cell-T-${tableId}-R${rowIndex}-C${cellIndex}`;

  /* Green "+" button that appends a new cell to the right of the current cell */
  const addCellButton = document.createElement('button');
  addCellButton.textContent = '+';
  addCellButton.className = 'add-cell-button';
  addCellButton.style.width = '15px';
  addCellButton.style.height = '15px';
  addCellButton.style.border = 'none';
  addCellButton.style.borderRadius = '3px';
  addCellButton.style.backgroundColor = '#10b981';
  addCellButton.style.color = 'white';
  addCellButton.style.fontSize = '12px';
  addCellButton.style.cursor = 'pointer';
  addCellButton.style.display = 'flex';
  addCellButton.style.alignItems = 'center';
  addCellButton.style.justifyContent = 'center';
  addCellButton.style.fontWeight = 'bold';

  addCellButton.addEventListener('mouseenter', () => {
    addCellButton.style.backgroundColor = '#059669';
  });

  addCellButton.addEventListener('mouseleave', () => {
    addCellButton.style.backgroundColor = '#10b981';
  });

  addCellButton.addEventListener('click', e => {
    e.stopPropagation();
    AddCellToRow(cell, tableId);
  });

  /* Red "×" button that removes this cell (or the whole row if it is the last cell) */
  const deleteCellButton = document.createElement('button');
  deleteCellButton.innerHTML = '×';
  deleteCellButton.className = 'delete-cell-button';
  deleteCellButton.style.width = '15px';
  deleteCellButton.style.height = '15px';
  deleteCellButton.style.border = 'none';
  deleteCellButton.style.borderRadius = '3px';
  deleteCellButton.style.backgroundColor = '#ef4444';
  deleteCellButton.style.color = 'white';
  deleteCellButton.style.fontSize = '14px';
  deleteCellButton.style.cursor = 'pointer';
  deleteCellButton.style.display = 'flex';
  deleteCellButton.style.alignItems = 'center';
  deleteCellButton.style.justifyContent = 'center';
  deleteCellButton.style.fontWeight = 'bold';

  deleteCellButton.addEventListener('mouseenter', () => {
    deleteCellButton.style.backgroundColor = '#dc2626';
  });

  deleteCellButton.addEventListener('mouseleave', () => {
    deleteCellButton.style.backgroundColor = '#ef4444';
  });

  deleteCellButton.addEventListener('click', e => {
    e.stopPropagation();
    DeleteCell(cell);
  });

  controlsContainer.appendChild(addCellButton);
  controlsContainer.appendChild(deleteCellButton);
  cell.appendChild(contentElement);
  cell.appendChild(controlsContainer);

  return cell;
}
