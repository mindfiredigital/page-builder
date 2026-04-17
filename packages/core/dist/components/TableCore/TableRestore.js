/* Restores a previously serialised table component to a fully interactive state */
import { AddCellToRow, DeleteCell } from './TableCellManager.js';
import { AddRows } from './TableRowManager.js';
import { EvaluateRowVisibility } from './TableVisibility.js';
/* Returns default values for all Input-typed attributes in the given config */
export function GetDefaultValuesOfInput(tableAttributeConfig) {
  const defaults = {};
  tableAttributeConfig.forEach(attr => {
    if (
      attr.type === 'Input' &&
      attr.default_value !== undefined &&
      attr.default_value !== null
    ) {
      defaults[attr.key] = attr.default_value;
    }
  });
  return defaults;
}
/* Re-attaches event listeners and restores visual state for all cells in the container */
export function Restore(container, editable, tableAttributeConfig) {
  const tableWrapper = container.querySelector('.table-wrapper');
  const closestTable =
    tableWrapper === null || tableWrapper === void 0
      ? void 0
      : tableWrapper.closest('.table-component');
  const tableId =
    closestTable === null || closestTable === void 0 ? void 0 : closestTable.id;
  if (!tableWrapper) {
    console.error('No table wrapper found in container');
    return;
  }
  /* Strip any lingering selection highlights from rows */
  const rows = tableWrapper.querySelectorAll('.table-row');
  rows.forEach(row => {
    const rowElement = row;
    if (rowElement.classList.contains('selected')) {
      rowElement.classList.remove('selected');
    }
  });
  /* Restore each cell's content and re-bind its control button events */
  const cells = tableWrapper.querySelectorAll('.table-cell');
  cells.forEach(cell => {
    const cellElement = cell;
    const attributeKey = cellElement.getAttribute('data-attribute-key');
    const attributeType = cellElement.getAttribute('data-attribute-type');
    const textContentOfCell = cell.querySelector('.table-cell-content');
    /* Remove stale selection state from content span */
    if (
      textContentOfCell === null || textContentOfCell === void 0
        ? void 0
        : textContentOfCell.classList.contains('selected')
    ) {
      textContentOfCell.classList.remove('selected');
    }
    if (attributeKey && textContentOfCell) {
      const attribute = tableAttributeConfig.find(
        attr => attr.key === attributeKey
      );
      if (attribute) {
        const controlsElement = cell.querySelector('.cell-controls');
        if (
          attribute.default_value &&
          (attributeType === 'Formula' || attributeType === 'Input')
        ) {
          /* Restore seeded default value with standard text styles */
          textContentOfCell.textContent = `${attribute.default_value}`;
          cellElement.style.fontSize = '14px';
          cellElement.style.color = '#000000';
        } else if (attributeType === 'Formula') {
          /* Restore formula placeholder title with muted styling */
          textContentOfCell.textContent = `${attribute.title}`;
          cellElement.style.fontSize = '10px';
          cellElement.style.color = 'rgb(188 191 198)';
          cellElement.style.fontWeight = '500';
        }
        if (controlsElement) {
          cell.appendChild(controlsElement);
        }
      }
    }
    const controls = cellElement.querySelector('.cell-controls');
    /* In read-only mode strip controls and remove content editability */
    if (editable === false) {
      controls === null || controls === void 0 ? void 0 : controls.remove();
      textContentOfCell === null || textContentOfCell === void 0
        ? void 0
        : textContentOfCell.removeAttribute('contenteditable');
      return;
    }
    /* Re-bind add / delete listeners after deserialisation */
    if (controls) {
      const addButton = controls.querySelector('.add-cell-button');
      const deleteButton = controls.querySelector('.delete-cell-button');
      if (addButton) {
        addButton.addEventListener('click', e => {
          e.stopPropagation();
          AddCellToRow(cellElement, tableId);
        });
      }
      if (deleteButton) {
        deleteButton.addEventListener('click', e => {
          e.stopPropagation();
          DeleteCell(cellElement);
        });
      }
    }
  });
  /* Re-bind or remove the "Add Row" button depending on edit mode */
  const addMultipleRowsButton = container.querySelector(
    '.add-multiple-rows-button'
  );
  const btnContainer = container.querySelector('.table-btn-container');
  const rowCountInput = container.querySelector('.row-count-input');
  if (addMultipleRowsButton && editable !== false) {
    rowCountInput.value = '1';
    addMultipleRowsButton.addEventListener('click', () => {
      const count = parseInt(rowCountInput.value) || 1;
      AddRows(tableWrapper, tableId, Math.min(Math.max(count, 1), 20));
    });
  } else if (editable === false && btnContainer) {
    /* Remove add-row controls entirely in read-only mode */
    btnContainer === null || btnContainer === void 0
      ? void 0
      : btnContainer.remove();
  }
  /* Apply default input values to evaluate initial row visibility */
  const defaultValues = GetDefaultValuesOfInput(tableAttributeConfig);
  EvaluateRowVisibility(defaultValues, container);
}
