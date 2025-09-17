import { Canvas } from '../canvas/Canvas';
import { ModalComponent } from './ModalManager';

export class TableComponent {
  static tableAttributeConfig: ComponentAttribute[];
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
    container.style.minWidth = '250px';
    container.style.border = '1px solid #2F3132';
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
      addRowButton.contentEditable = 'false';
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

  evaluateRowVisibility(inputValues: Record<string, any>, table?: HTMLElement) {
    let allRows;
    if (table) {
      allRows = table.querySelectorAll('.table-row');
    } else {
      allRows = document.querySelectorAll('.table-row');
    }

    allRows.forEach(row => {
      const rulesAttribute = row.getAttribute('data-visibility-rules');

      if (!rulesAttribute) {
        (row as HTMLElement).style.display = 'grid';
        return;
      }

      try {
        const rules = JSON.parse(rulesAttribute);

        if (rules.length === 0) {
          (row as HTMLElement).style.display = 'grid';
          return;
        }

        let isVisible = true;
        rules.forEach((rule: any) => {
          const inputValue = inputValues[rule.inputKey];
          const isConditionMet = this.evaluateRule(
            inputValue,
            rule.operator,
            rule.value
          );

          if (isConditionMet) {
            if (rule.action === 'hide') {
              isVisible = false;
            } else if (rule.action === 'show') {
              isVisible = true;
            }
          } else {
            if (rule.action === 'show') {
              isVisible = false;
            }
          }
        });

        if (isVisible) {
          (row as HTMLElement).style.display = 'grid';
        } else {
          (row as HTMLElement).style.display = 'none';
        }
      } catch (e) {
        console.error('Failed to parse or evaluate visibility rules:', e);
      }
    });
  }

  private evaluateRule(
    inputValue: string,
    operator: string,
    ruleValue: string
  ): boolean | string {
    const numInputValue = parseFloat(inputValue);
    const numRuleValue = parseFloat(ruleValue);

    const lowerCaseInputValue = inputValue.toLowerCase();
    const lowerCaseRuleValue = ruleValue.toLowerCase();
    switch (operator) {
      case 'equals':
        return lowerCaseInputValue === lowerCaseRuleValue;
      case 'not_equals':
        return lowerCaseInputValue !== lowerCaseRuleValue;
      case 'greater_than':
        return (
          !isNaN(numInputValue) &&
          !isNaN(numRuleValue) &&
          numInputValue > numRuleValue
        );
      case 'less_than':
        return (
          !isNaN(numInputValue) &&
          !isNaN(numRuleValue) &&
          numInputValue < numRuleValue
        );
      case 'contains':
        return lowerCaseInputValue.includes(lowerCaseRuleValue);
      default:
        return false;
    }
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
    rowDiv.id = `table-row-T-${tableId}-R${rowIndex}`;
    rowDiv.style.position = 'relative';
    rowDiv.style.cursor = 'pointer';
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

    cell.style.border = '1px solid #2F3132';
    cell.style.minHeight = '45px';
    cell.style.position = 'relative';
    cell.style.cursor = 'pointer';
    cell.style.transition = 'background-color 0.2s ease';
    cell.style.display = 'flex';
    cell.style.alignItems = 'center';
    cell.style.justifyContent = 'flex-start';

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
    controlsContainer.contentEditable = 'false';
    const contentElement = document.createElement('span');
    contentElement.textContent = `R${rowIndex + 1}C${cellIndex + 1}`;
    contentElement.contentEditable = 'true';
    contentElement.classList.add('table-cell-content');
    contentElement.id = `table-cell-T-${tableId}-R${rowIndex}-C${cellIndex}`;

    // Add Cell button
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
      this.addCellToRow(cell, tableId);
    });

    // Delete Cell button
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
      this.deleteCell(cell);
    });

    controlsContainer.appendChild(addCellButton);
    controlsContainer.appendChild(deleteCellButton);
    cell.appendChild(contentElement);
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

  seedFormulaValues(values: Record<string, any>) {
    const allTables = document.querySelectorAll('.table-component');

    allTables.forEach(table => {
      const cells = table.querySelectorAll('div[data-attribute-key]');

      cells.forEach(cell => {
        const controlsElement = cell.querySelector('.cell-controls');
        const key = cell.getAttribute('data-attribute-key');
        const textContentCell = cell.querySelector('.table-cell-content');

        if (textContentCell && key && values.hasOwnProperty(key)) {
          textContentCell.textContent = values[key];
          (cell as HTMLElement).style.color = '#000000';
        }

        if (controlsElement) {
          cell.appendChild(controlsElement);
        }
      });
    });

    Canvas.dispatchDesignChange();
  }

  updateInputValues(values: Record<string, any>) {
    const allTables = document.querySelectorAll('.table-component');

    allTables.forEach(table => {
      const cells = table.querySelectorAll('div[data-attribute-key]');

      cells.forEach(cell => {
        const key = cell.getAttribute('data-attribute-key');
        const type = cell.getAttribute('data-attribute-type');
        const textContentOfCell = cell.querySelector('.table-cell-content');

        if (
          textContentOfCell &&
          key &&
          values.hasOwnProperty(key) &&
          type === 'Input'
        ) {
          textContentOfCell.textContent = values[key];
        }
      });
    });

    Canvas.dispatchDesignChange();
  }

  updateCellContent(cell: HTMLElement, attribute: ComponentAttribute): void {
    cell.setAttribute('data-attribute-key', attribute.key);
    cell.setAttribute('data-attribute-type', attribute.type);
    const controlsElement = cell.querySelector('.cell-controls');
    const textContentOfCell = cell.querySelector('.table-cell-content');

    if (attribute.type === 'Formula' && textContentOfCell) {
      textContentOfCell.textContent = `${attribute.title}`;
      cell.style.fontSize = '10px';
      cell.style.color = 'rgb(188 191 198)';
      cell.style.fontWeight = '500';
    } else if (attribute.type === 'Constant' && textContentOfCell) {
      textContentOfCell.textContent = `${attribute.value}`;
    }
    if (controlsElement) {
      cell.appendChild(controlsElement);
    }

    Canvas?.dispatchDesignChange();
  }

  setModalComponent(modalComponent: ModalComponent): void {
    this.modalComponent = modalComponent;
  }

  addRow(tableWrapper: HTMLElement, tableId: string): void {
    const rowCount = tableWrapper.children.length;

    const newRow = this.createTableRow(rowCount, 1, tableId);
    tableWrapper.appendChild(newRow);
    Canvas.dispatchDesignChange();
  }

  private static getDefaultValuesOfInput(): Record<string, any> {
    const defaults: Record<string, any> = {};
    TableComponent.tableAttributeConfig.forEach(attr => {
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

  static restore(container: HTMLElement, editable: boolean | null): void {
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

      const attributeKey = cellElement.getAttribute('data-attribute-key');
      const attributeType = cellElement.getAttribute('data-attribute-type');
      const textContentOfCell = cell.querySelector('.table-cell-content');

      if (attributeKey && textContentOfCell) {
        const attribute = TableComponent.tableAttributeConfig.find(
          attr => attr.key === attributeKey
        );
        if (attribute) {
          const controlsElement = cell.querySelector('.cell-controls');

          if (
            attribute.default_value &&
            (attributeType === 'Formula' || attributeType === 'Input')
          ) {
            textContentOfCell.textContent = `${attribute.default_value}`;
            cellElement.style.fontSize = '14px';
            cellElement.style.color = '#000000';
          } else if (attributeType === 'Formula') {
            // Restore the title and styling for formula cells
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
      if (editable === false) {
        controls?.remove();
        return;
      }
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
    if (addRowButton && editable !== false) {
      addRowButton.addEventListener('click', () => {
        instance.addRow(tableWrapper as HTMLElement, tableId!);
      });
    } else if (editable === false) {
      addRowButton.remove();
    }
    const defaultValues = TableComponent.getDefaultValuesOfInput();
    instance.evaluateRowVisibility(defaultValues, container);
  }
}
