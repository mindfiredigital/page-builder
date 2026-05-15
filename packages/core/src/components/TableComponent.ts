/* Main TableComponent class — composes all TableCore modules into the original public API */

import { Canvas } from '../canvas/Canvas';
import { ModalComponent } from './ModalManager';
import {
  StyleButton,
  CreateTableRow,
  AddRows,
  EvaluateRowVisibility,
  SeedFormulaValues,
  UpdateInputValues,
  UpdateCellContent,
  Restore,
} from './TableCore';

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
      const row = CreateTableRow(i, columnCount, tableId);
      tableWrapper.appendChild(row);
    }

    container.appendChild(tableWrapper);

    if (!isPreview) {
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('table-btn-container');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '10px';
      buttonContainer.style.justifyContent = 'center';
      buttonContainer.style.marginTop = '10px';
      buttonContainer.style.marginBottom = '10px';

      const multiRowContainer = document.createElement('div');
      multiRowContainer.style.display = 'flex';
      multiRowContainer.style.alignItems = 'center';
      multiRowContainer.style.gap = '5px';

      const rowCountInput = document.createElement('input');
      rowCountInput.className = 'row-count-input';
      rowCountInput.type = 'number';
      rowCountInput.min = '1';
      rowCountInput.max = '20';
      rowCountInput.value = '1';
      rowCountInput.style.width = '60px';
      rowCountInput.style.padding = '4px 8px';
      rowCountInput.style.border = '1px solid #d1d5db';
      rowCountInput.style.borderRadius = '4px';
      rowCountInput.style.fontSize = '14px';

      const addMultipleRowsButton = document.createElement('button');
      addMultipleRowsButton.textContent = 'Add Row';
      addMultipleRowsButton.className = 'add-multiple-rows-button';
      addMultipleRowsButton.contentEditable = 'false';
      StyleButton(addMultipleRowsButton, '#10b981', '#059669');

      addMultipleRowsButton.addEventListener('click', () => {
        const count = parseInt(rowCountInput.value) || 1;
        AddRows(tableWrapper, tableId, Math.min(Math.max(count, 1), 20));
      });

      multiRowContainer.appendChild(rowCountInput);
      multiRowContainer.appendChild(addMultipleRowsButton);
      buttonContainer.appendChild(multiRowContainer);
      container.appendChild(buttonContainer);
    }

    return container;
  }

  evaluateRowVisibility(values: AttributeValues, table?: HTMLElement): void {
    EvaluateRowVisibility(values, table);
  }

  seedFormulaValues(values: AttributeValues): void {
    SeedFormulaValues(values);
  }

  updateInputValues(values: AttributeValues): void {
    UpdateInputValues(values);
  }

  updateCellContent(cell: HTMLElement, attribute: ComponentAttribute): void {
    UpdateCellContent(cell, attribute);
  }

  addRows(tableWrapper: HTMLElement, tableId: string, count: number = 1): void {
    AddRows(tableWrapper, tableId, count);
  }

  setModalComponent(modalComponent: ModalComponent): void {
    this.modalComponent = modalComponent;
  }

  static restore(container: HTMLElement, editable: boolean | null): void {
    Restore(container, editable, TableComponent.tableAttributeConfig);
  }
}
