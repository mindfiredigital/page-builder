import { Canvas } from '../canvas/Canvas';
import { ModalComponent } from './ModalManager';

export class TableComponent {
  private static tableAttributeConfig: ComponentAttribute[];
  private modalComponent: ModalComponent | null = null;

  constructor() {
    this.modalComponent = new ModalComponent() || null;
  }

  create(
    rowCount: number,
    columnCount: number,
    isPreview: boolean = false,
    tableAttributeConfig: ComponentAttribute[] | undefined | [] | null
  ): HTMLElement {
    TableComponent.tableAttributeConfig = tableAttributeConfig || [];

    const container = document.createElement('div');
    container.classList.add('table-component');
    const tableId = Canvas.generateUniqueClass('table');
    container.id = tableId;
    container.style.minWidth = '400px';
    container.style.margin = '0 auto 16px auto';
    container.style.border = '1px solid #d1d5db';
    container.style.borderRadius = '8px';

    container.style.display = 'flex';
    container.style.flexDirection = 'column';

    const tableWrapper = document.createElement('div');
    tableWrapper.style.display = 'flex';
    tableWrapper.style.flexDirection = 'column';
    tableWrapper.classList.add('table-wrapper');
    for (let i = 0; i < rowCount; i++) {
      const row = this.createTableRow(i, columnCount, tableId);
      tableWrapper.appendChild(row);
    }

    container.appendChild(tableWrapper);

    if (!isPreview) {
      const addRowButton = document.createElement('button');
      addRowButton.textContent = 'Add Row';
      addRowButton.className = 'add-row-button';
      this.styleButton(addRowButton, '#2563eb', '#1d4ed8');

      addRowButton.addEventListener('click', () => {
        this.addRow(tableWrapper, tableId);
      });

      const buttonContainer = document.createElement('div');
      buttonContainer.style.textAlign = 'center';
      buttonContainer.style.marginTop = '10px';
      buttonContainer.style.marginBottom = '10px';
      buttonContainer.appendChild(addRowButton);

      container.appendChild(buttonContainer);
    }

    return container;
  }

  private createTableRow(
    rowIndex: number,
    cellCount: number,
    tableId: string
  ): HTMLElement {
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'grid';
    rowDiv.style.gridTemplateColumns = `repeat(${cellCount}, 1fr)`;
    rowDiv.className = 'table-row';

    for (let j = 0; j < cellCount; j++) {
      const cell = this.createTableCell(rowIndex, j, tableId);
      rowDiv.appendChild(cell);
    }

    return rowDiv;
  }

  private createTableCell(
    rowIndex: number,
    cellIndex: number,
    tableId: string
  ): HTMLElement {
    const cell = document.createElement('div');
    cell.className = 'table-cell';

    cell.id = `table-cell-T-${tableId}-R${rowIndex}-C${cellIndex}`;
    cell.textContent = `R${rowIndex + 1}C${cellIndex + 1}`;
    cell.style.border = '1px solid #d1d5db';
    cell.style.padding = '8px 12px';
    cell.style.minHeight = '50px';
    cell.style.position = 'relative';
    cell.style.cursor = 'pointer';
    cell.style.transition = 'background-color 0.2s ease';
    cell.style.display = 'flex';
    cell.style.alignItems = 'center';
    cell.style.justifyContent = 'center';

    // Add hover effect
    cell.addEventListener('mouseenter', () => {
      if (!cell.hasAttribute('data-attribute-key')) {
        cell.style.backgroundColor = '#f0f8ff';
      }
    });

    cell.addEventListener('mouseleave', () => {
      if (!cell.hasAttribute('data-attribute-key')) {
        cell.style.backgroundColor = '';
      }
    });

    // Create control buttons container
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'cell-controls';
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.bottom = '5px';
    controlsContainer.style.right = '5px';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.gap = '4px';
    controlsContainer.style.alignItems = 'center';
    controlsContainer.style.justifyContent = 'center';

    // Add Cell button
    const addCellButton = document.createElement('button');
    addCellButton.textContent = '+';
    addCellButton.className = 'add-cell-button';
    addCellButton.style.width = '20px';
    addCellButton.style.height = '20px';
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
      this.addCellToRow(cell, tableId);
    });

    // Delete Cell button
    const deleteCellButton = document.createElement('button');
    deleteCellButton.innerHTML = '×';
    deleteCellButton.className = 'delete-cell-button';
    deleteCellButton.style.width = '20px';
    deleteCellButton.style.height = '20px';
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
      this.deleteCell(cell);
    });

    controlsContainer.appendChild(addCellButton);
    controlsContainer.appendChild(deleteCellButton);
    cell.appendChild(controlsContainer);

    return cell;
  }

  private addCellToRow(referenceCell: HTMLElement, tableId: string): void {
    const row = referenceCell.parentElement;
    if (!row) return;

    const rowIndex = Array.from(row.parentElement!.children).indexOf(row);
    const currentCellCount = row.children.length;

    const newCell = this.createTableCell(rowIndex, currentCellCount, tableId);
    row.appendChild(newCell);

    row.style.gridTemplateColumns = `repeat(${currentCellCount + 1}, 1fr)`;
  }

  private deleteCell(cellToDelete: HTMLElement): void {
    const row = cellToDelete.parentElement;
    if (!row) return;

    const cellCount = row.children.length;

    row.removeChild(cellToDelete);

    if (cellCount === 1) {
      const tableWrapper = row.parentElement;
      if (tableWrapper && tableWrapper.children.length > 1) {
        tableWrapper.removeChild(row);
      }
    } else {
      row.style.gridTemplateColumns = `repeat(${cellCount - 1}, 1fr)`;
    }
  }

  private styleButton(
    button: HTMLButtonElement,
    bgColor: string,
    hoverColor: string
  ): void {
    button.style.padding = '8px 16px';
    button.style.backgroundColor = bgColor;
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '6px';
    button.style.fontSize = '14px';
    button.style.fontWeight = '500';
    button.style.cursor = 'pointer';
    button.style.transition = 'background-color 0.2s ease';

    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = hoverColor;
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = bgColor;
    });
  }

  async handleCellClick(cell: HTMLElement): Promise<void> {
    if (
      !this.modalComponent ||
      !TableComponent.tableAttributeConfig ||
      TableComponent.tableAttributeConfig.length === 0
    ) {
      console.warn('Modal component or table attribute config not available');
      return;
    }

    try {
      const result = await this.modalComponent.show(
        TableComponent.tableAttributeConfig
      );

      if (result) {
        const selectedAttribute = this.findSelectedAttribute(result);

        if (selectedAttribute) {
          this.updateCellContent(cell, selectedAttribute, result);
        }
      }
    } catch (error) {
      console.error('Error handling cell click:', error);
    }
  }

  private findSelectedAttribute(
    result: Record<string, any>
  ): ComponentAttribute | null {
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

  seedFormulaValues(table: HTMLElement, values: Record<string, any>) {
    const cells = table.querySelectorAll('div[data-attribute-key]');
    cells.forEach(cell => {
      const key = cell.getAttribute('data-attribute-key');
      if (key && values.hasOwnProperty(key)) {
        cell.textContent = values[key];
        (cell as HTMLElement).style.color = '#000000';
      }
    });
    Canvas.dispatchDesignChange();
  }

  private updateCellContent(
    cell: HTMLElement,
    attribute: ComponentAttribute,
    result: Record<string, any>
  ): void {
    cell.setAttribute('data-attribute-key', attribute.key);
    cell.setAttribute('data-attribute-type', attribute.type);

    const controlsElement = cell.querySelector('.cell-controls');
    cell.textContent = `${attribute.title}`;

    if (controlsElement) {
      cell.appendChild(controlsElement);
    }
    cell.style.fontSize = '10px';
    cell.style.color = 'rgb(188 191 198)';
    cell.style.fontWeight = '500';
    Canvas?.dispatchDesignChange();
  }

  setModalComponent(modalComponent: ModalComponent): void {
    this.modalComponent = modalComponent;
  }

  addRow(tableWrapper: HTMLElement, tableId: string): void {
    const rowCount = tableWrapper.children.length;

    const newRow = this.createTableRow(rowCount, 1, tableId);
    tableWrapper.appendChild(newRow);
  }

  setRowCount(tableWrapper: HTMLElement, targetRowCount: number): void {
    if (!tableWrapper) return;

    const currentRowCount = tableWrapper.children.length;
    const closestTable = tableWrapper.closest('.table-component');
    const tableId = closestTable?.id;
    if (targetRowCount < 0) targetRowCount = 0;

    if (targetRowCount > currentRowCount) {
      // Add rows
      for (let i = currentRowCount; i < targetRowCount; i++) {
        this.addRow(tableWrapper, tableId!);
      }
    } else if (targetRowCount < currentRowCount) {
      // Remove rows
      for (let i = currentRowCount - 1; i >= targetRowCount; i--) {
        const rowToRemove = tableWrapper.children[i];
        tableWrapper.removeChild(rowToRemove);
      }
    }
  }

  createHeder(tableWrapper: HTMLElement): void {
    if (!tableWrapper || tableWrapper.children.length === 0) return;

    const firstRow = tableWrapper.children[0] as HTMLElement;
    const cells = firstRow.querySelectorAll('.table-cell');

    cells.forEach((cell, index) => {
      const cellElement = cell as HTMLElement;
      cellElement.style.fontWeight = 'bold';
      cellElement.style.backgroundColor = '#f8fafc';
      cellElement.style.borderBottom = '2px solid #374151';
    });
  }

  static restore(container: HTMLElement): void {
    const instance = new TableComponent();
    const tableWrapper = container.querySelector('.table-wrapper');
    const closestTable = tableWrapper?.closest('.table-component');
    const tableId = closestTable?.id;
    if (!tableWrapper) {
      console.error('No table wrapper found in container');
      return;
    }

    const cells = tableWrapper.querySelectorAll('.table-cell');
    cells.forEach(cell => {
      const cellElement = cell as HTMLElement;

      const controls = cellElement.querySelector('.cell-controls');
      if (controls) {
        const addButton = controls.querySelector('.add-cell-button');
        const deleteButton = controls.querySelector('.delete-cell-button');

        if (addButton) {
          addButton.addEventListener('click', e => {
            e.stopPropagation();
            instance.addCellToRow(cellElement, tableId!);
          });
        }

        if (deleteButton) {
          deleteButton.addEventListener('click', e => {
            e.stopPropagation();
            instance.deleteCell(cellElement);
          });
        }
      }
    });

    const addRowButton = container.querySelector(
      '.add-row-button'
    ) as HTMLButtonElement;
    if (addRowButton) {
      addRowButton.addEventListener('click', () => {
        instance.addRow(tableWrapper as HTMLElement, tableId!);
      });
    }
  }
}
