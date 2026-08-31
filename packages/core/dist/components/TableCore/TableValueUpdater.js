/* Utilities for pushing data values into table cells at runtime */
import { Canvas } from '../../canvas/Canvas.js';
/* Writes resolved formula values into cells that carry a matching data-attribute-key */
export function SeedFormulaValues(values) {
    const allTables = document.querySelectorAll('.table-component');
    allTables.forEach(table => {
        const cells = table.querySelectorAll('div[data-attribute-key]');
        cells.forEach(cell => {
            const controlsElement = cell.querySelector('.cell-controls');
            const key = cell.getAttribute('data-attribute-key');
            const textContentCell = cell.querySelector('.table-cell-content');
            if (textContentCell &&
                key &&
                Object.prototype.hasOwnProperty.call(values, key)) {
                textContentCell.textContent = String(values[key]);
                cell.style.color = '#000000';
                cell.style.fontSize = '16px';
            }
            if (controlsElement) {
                cell.appendChild(controlsElement);
            }
        });
    });
    Canvas.dispatchDesignChange();
}
/* Pushes live input values into cells typed as "Input" */
export function UpdateInputValues(values) {
    const allTables = document.querySelectorAll('.table-component');
    allTables.forEach(table => {
        const cells = table.querySelectorAll('div[data-attribute-key]');
        cells.forEach(cell => {
            const key = cell.getAttribute('data-attribute-key');
            const type = cell.getAttribute('data-attribute-type');
            const textContentOfCell = cell.querySelector('.table-cell-content');
            if (textContentOfCell &&
                key &&
                Object.prototype.hasOwnProperty.call(values, key) &&
                type === 'Input') {
                textContentOfCell.textContent = String(values[key]);
            }
        });
    });
    Canvas.dispatchDesignChange();
}
/* Binds an attribute to a cell and renders its display value based on attribute type */
export function UpdateCellContent(cell, attribute) {
    cell.setAttribute('data-attribute-key', attribute.key);
    cell.setAttribute('data-attribute-type', attribute.type);
    const controlsElement = cell.querySelector('.cell-controls');
    const textContentOfCell = cell.querySelector('.table-cell-content');
    if (attribute.type === 'Formula' && textContentOfCell) {
        textContentOfCell.textContent = attribute.title;
        cell.style.fontSize = '10px';
        cell.style.color = 'rgb(188 191 198)';
        cell.style.fontWeight = '500';
    }
    else if (attribute.type === 'Constant' && textContentOfCell) {
        textContentOfCell.textContent = String(attribute.value);
    }
    else if (attribute.type === 'Input' && textContentOfCell) {
        textContentOfCell.textContent = String(attribute.value);
    }
    if (controlsElement) {
        cell.appendChild(controlsElement);
    }
    Canvas.dispatchDesignChange();
}
