var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { ModalComponent } from './ModalManager.js';
export class TableComponent {
  constructor() {
    this.modalComponent = null;
    this.modalComponent = new ModalComponent() || null;
  }
  create(rowCount, columnCount, isPreview = false, tableAttributeConfig) {
    // Store the table attribute config for later use
    TableComponent.tableAttributeConfig = tableAttributeConfig || [];
    // Create a container for the table
    const container = document.createElement('div');
    container.classList.add('table-component');
    // Create the table element
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.overflow = 'auto';
    table.style.borderCollapse = 'collapse';
    // Generate table rows and cells
    for (let i = 0; i < rowCount; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < columnCount; j++) {
        const cell = document.createElement('td');
        cell.textContent = `R${i + 1}C${j + 1}`;
        cell.style.border = '1px solid #000';
        cell.style.padding = '8px';
        cell.style.cursor = 'pointer';
        cell.style.transition = 'background-color 0.2s ease';
        // Add hover effect
        cell.addEventListener('mouseenter', () => {
          cell.style.backgroundColor = '#f0f8ff';
        });
        cell.addEventListener('mouseleave', () => {
          cell.style.backgroundColor = '';
        });
        // Add click event listener to open modal
        cell.addEventListener('click', () => {
          this.handleCellClick(cell);
        });
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    // Add table to container
    container.appendChild(table);
    // Add buttons only if not in preview mode
    if (!isPreview) {
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');
      buttonContainer.style.marginTop = '10px';
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '10px';
      // Add Row button
      const addRowButton = document.createElement('button');
      addRowButton.textContent = 'Add Row';
      addRowButton.addEventListener('click', () => this.addRow(table));
      buttonContainer.appendChild(addRowButton);
      // Add Column button
      const addColumnButton = document.createElement('button');
      addColumnButton.textContent = 'Add Column';
      addColumnButton.addEventListener('click', () => this.addColumn(table));
      buttonContainer.appendChild(addColumnButton);
      container.appendChild(buttonContainer);
    }
    return container;
  }
  /**
   * Handles cell click events to open the modal with table configuration
   * @param cell The clicked table cell element
   */
  handleCellClick(cell) {
    return __awaiter(this, void 0, void 0, function* () {
      // Check if modal component is available and table config exists
      if (
        !this.modalComponent ||
        !TableComponent.tableAttributeConfig ||
        TableComponent.tableAttributeConfig.length === 0
      ) {
        console.warn('Modal component or table attribute config not available');
        return;
      }
      try {
        // Open modal with table configuration
        const result = yield this.modalComponent.show(
          TableComponent.tableAttributeConfig
        );
        if (result) {
          // Find which attribute was selected based on the result
          const selectedAttribute = this.findSelectedAttribute(result);
          if (selectedAttribute) {
            // Update cell content with the selected attribute's key or value
            this.updateCellContent(cell, selectedAttribute, result);
          }
        }
        // If result is null (modal was closed), keep existing cell content
      } catch (error) {
        console.error('Error handling cell click:', error);
      }
    });
  }
  /**
   * Finds the selected attribute based on modal result
   * @param result The result from the modal
   * @returns The selected ComponentAttribute or null
   */
  findSelectedAttribute(result) {
    // Look for the attribute that has a meaningful change or selection
    for (const attr of TableComponent.tableAttributeConfig) {
      if (
        result.hasOwnProperty(attr.key) &&
        result[attr.key] !== undefined &&
        result[attr.key] !== ''
      ) {
        return attr;
      }
    }
    return null;
  }
  /**
   * Updates the cell content based on the selected attribute
   * @param cell The table cell to update
   * @param attribute The selected attribute
   * @param result The modal result
   */
  updateCellContent(cell, attribute, result) {
    // Store the attribute key as data attribute for future reference
    cell.setAttribute('data-attribute-key', attribute.key);
    cell.setAttribute('data-attribute-type', attribute.type);
    // Update cell content based on attribute type
    // switch (attribute.type) {
    //   case 'Input':
    //     cell.textContent = result[attribute.key] || attribute.key;
    //     break;
    //   case 'Constant':
    //   case 'Formula':
    cell.textContent = `${attribute.key}: ${attribute.value}`;
    //     break;
    //   case 'Image':
    //     // For image type, you might want to show just the key or a placeholder
    //     cell.textContent = `${attribute.key} (Image)`;
    //     break;
    //   default:
    //     cell.textContent = attribute.key;
    // }
    // Add visual indication that this cell has an attribute
    cell.style.backgroundColor = '#e6f3ff';
    cell.style.fontWeight = 'bold';
  }
  /**
   * Sets the modal component for this table instance
   * @param modalComponent The modal component instance
   */
  setModalComponent(modalComponent) {
    this.modalComponent = modalComponent;
  }
  addRow(table) {
    var _a;
    const rowCount = table.rows.length;
    const columnCount =
      ((_a = table.rows[0]) === null || _a === void 0
        ? void 0
        : _a.cells.length) || 0;
    const row = document.createElement('tr');
    for (let i = 0; i < columnCount; i++) {
      const cell = document.createElement('td');
      cell.textContent = `R${rowCount + 1}C${i + 1}`;
      cell.style.border = '1px solid #000';
      cell.style.padding = '8px';
      cell.style.cursor = 'pointer';
      cell.style.transition = 'background-color 0.2s ease';
      // Add hover effect
      cell.addEventListener('mouseenter', () => {
        cell.style.backgroundColor = '#f0f8ff';
      });
      cell.addEventListener('mouseleave', () => {
        cell.style.backgroundColor = '';
      });
      // Add click event listener
      cell.addEventListener('click', () => {
        this.handleCellClick(cell);
      });
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  addColumn(table) {
    const rowCount = table.rows.length;
    for (let i = 0; i < rowCount; i++) {
      const cell = document.createElement('td');
      cell.textContent = `R${i + 1}C${table.rows[i].cells.length + 1}`;
      cell.style.border = '1px solid #000';
      cell.style.padding = '8px';
      cell.style.cursor = 'pointer';
      cell.style.transition = 'background-color 0.2s ease';
      // Add hover effect
      cell.addEventListener('mouseenter', () => {
        cell.style.backgroundColor = '#f0f8ff';
      });
      cell.addEventListener('mouseleave', () => {
        cell.style.backgroundColor = '';
      });
      // Add click event listener
      cell.addEventListener('click', () => {
        this.handleCellClick(cell);
      });
      table.rows[i].appendChild(cell);
    }
  }
  setRowCount(table, targetRowCount) {
    var _a;
    if (!table) return;
    const currentRowCount = table.rows.length;
    const currentColumnCount =
      ((_a = table.rows[0]) === null || _a === void 0
        ? void 0
        : _a.cells.length) || 0;
    if (targetRowCount < 0) targetRowCount = 0;
    if (targetRowCount > currentRowCount) {
      // Add rows
      for (let i = currentRowCount; i < targetRowCount; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < currentColumnCount; j++) {
          const cell = document.createElement('td');
          cell.textContent = `R${i + 1}C${j + 1}`;
          cell.style.border = '1px solid #000';
          cell.style.padding = '8px';
          cell.style.cursor = 'pointer';
          cell.style.transition = 'background-color 0.2s ease';
          // Add hover effect
          cell.addEventListener('mouseenter', () => {
            cell.style.backgroundColor = '#f0f8ff';
          });
          cell.addEventListener('mouseleave', () => {
            cell.style.backgroundColor = '';
          });
          // Add click event listener
          cell.addEventListener('click', () => {
            this.handleCellClick(cell);
          });
          row.appendChild(cell);
        }
        table.appendChild(row);
      }
    } else if (targetRowCount < currentRowCount) {
      // Remove rows
      for (let i = currentRowCount - 1; i >= targetRowCount; i--) {
        table.deleteRow(i);
      }
    }
  }
  setColumnCount(table, targetColumnCount) {
    if (!table || table.rows.length === 0) return;
    const currentRowCount = table.rows.length;
    const currentColumnCount = table.rows[0].cells.length;
    if (targetColumnCount < 0) targetColumnCount = 0;
    for (let i = 0; i < currentRowCount; i++) {
      const row = table.rows[i];
      if (targetColumnCount > currentColumnCount) {
        // Add columns
        for (let j = currentColumnCount; j < targetColumnCount; j++) {
          const cell = document.createElement('td');
          cell.textContent = `R${i + 1}C${j + 1}`;
          cell.style.border = '1px solid #000';
          cell.style.padding = '8px';
          cell.style.cursor = 'pointer';
          cell.style.transition = 'background-color 0.2s ease';
          // Add hover effect
          cell.addEventListener('mouseenter', () => {
            cell.style.backgroundColor = '#f0f8ff';
          });
          cell.addEventListener('mouseleave', () => {
            cell.style.backgroundColor = '';
          });
          // Add click event listener
          cell.addEventListener('click', () => {
            this.handleCellClick(cell);
          });
          row.appendChild(cell);
        }
      } else if (targetColumnCount < currentColumnCount) {
        // Remove columns
        for (let j = currentColumnCount - 1; j >= targetColumnCount; j--) {
          row.deleteCell(j);
        }
      }
    }
  }
  createHeder(table) {
    var _a;
    if (!table || table.rows.length === 0) return;
    const firstRow = table.rows[0];
    for (let i = 0; i < firstRow.cells.length; i++) {
      const tdElement = firstRow.cells[i];
      const thElement = document.createElement('th');
      thElement.innerHTML = tdElement.innerHTML;
      // Copy all attributes
      for (const attr of Array.from(tdElement.attributes)) {
        thElement.setAttribute(attr.name, attr.value);
      }
      // Ensure header styling
      thElement.style.cursor = 'pointer';
      thElement.style.transition = 'background-color 0.2s ease';
      // Add hover effect for header
      thElement.addEventListener('mouseenter', () => {
        thElement.style.backgroundColor = '#f0f8ff';
      });
      thElement.addEventListener('mouseleave', () => {
        thElement.style.backgroundColor = '';
      });
      // Add click event listener for header
      thElement.addEventListener('click', () => {
        this.handleCellClick(thElement); // Cast to work with headers
      });
      (_a = tdElement.parentNode) === null || _a === void 0
        ? void 0
        : _a.replaceChild(thElement, tdElement);
    }
  }
  static restore(container) {
    const instance = new TableComponent();
    const table = container.querySelector('table');
    if (!table) {
      console.error('No table found in container');
      return;
    }
    // Restore cell click functionality
    const cells = table.querySelectorAll('td, th');
    cells.forEach(cell => {
      const cellElement = cell;
      cellElement.style.cursor = 'pointer';
      cellElement.style.transition = 'background-color 0.2s ease';
      // Add hover effects
      cellElement.addEventListener('mouseenter', () => {
        cellElement.style.backgroundColor = '#f0f8ff';
      });
      cellElement.addEventListener('mouseleave', () => {
        cellElement.style.backgroundColor = '';
      });
      // Add click event listener
      cellElement.addEventListener('click', () => {
        instance.handleCellClick(cellElement);
      });
    });
    // Restore button functionality
    const buttonContainer = container.querySelector('.button-container');
    if (!buttonContainer) {
      console.error('No button container found');
      return;
    }
    const buttons = buttonContainer.querySelectorAll('button');
    buttons.forEach(button => {
      var _a;
      const newButton = button.cloneNode(true);
      (_a = button.parentNode) === null || _a === void 0
        ? void 0
        : _a.replaceChild(newButton, button);
      if (newButton.textContent === 'Add Row') {
        newButton.addEventListener('click', () => instance.addRow(table));
      } else if (newButton.textContent === 'Add Column') {
        newButton.addEventListener('click', () => instance.addColumn(table));
      }
    });
  }
}
