import { Canvas } from '../../canvas/Canvas';
import { ModalComponent } from '../../components/ModalManager';
import { TextComponent } from '../../components/TextComponent';
import { HeaderComponent } from '../../components/HeaderComponent';
import { TableComponent } from '../../components/TableComponent';
import { handleComponentClick } from '../componentClickManager';

/* Appends "Set Attribute" and "Delete Attribute" buttons to the functions panel */
export function populateModalButton(
  component: HTMLElement,
  functionsPanel: HTMLElement,
  editable: boolean | null
): void {
  if (editable === false) return;

  const componentType = component.classList[0].replace('-component', '');

  /* Table cells store the attribute on the parent .table-cell, not the clicked content span */
  const isTableCell = component.classList.contains('table-cell-content');
  const attributeTarget = isTableCell
    ? (component.closest('.table-cell') as HTMLElement)
    : component;

  /* ── Set Attribute button ──────────────────────────────────────────────── */
  const modalButton = document.createElement('button');
  modalButton.textContent = `Set ${componentType} Attribute`;
  modalButton.className = 'set-attribute-button';
  functionsPanel.appendChild(modalButton);

  /* ── Delete Attribute button ───────────────────────────────────────────── */
  const deleteAttributeButton = document.createElement('button');
  deleteAttributeButton.textContent = `Delete ${componentType} Attribute`;
  deleteAttributeButton.className = 'delete-attribute-button';
  functionsPanel.appendChild(deleteAttributeButton);

  /* Only show the delete button when an attribute is already bound */
  const refreshDeleteVisibility = (): void => {
    deleteAttributeButton.style.display = attributeTarget?.hasAttribute(
      'data-attribute-key'
    )
      ? 'block'
      : 'none';
  };
  refreshDeleteVisibility();

  deleteAttributeButton.addEventListener('click', () => {
    if (!attributeTarget) return;

    /* Strip binding attributes from the target element */
    attributeTarget.removeAttribute('data-attribute-key');
    attributeTarget.removeAttribute('data-attribute-type');

    if (isTableCell) {
      /* Reset cell text and clear formula inline styles */
      const textContentOfCell = attributeTarget.querySelector(
        '.table-cell-content'
      ) as HTMLElement | null;
      if (textContentOfCell) textContentOfCell.textContent = '';
      attributeTarget.style.color = '';
      attributeTarget.style.fontSize = '';
      attributeTarget.style.fontWeight = '';
    } else if (component.classList.contains('header-component')) {
      /* Reset header text and clear formula inline styles */
      const textContent = component.querySelector(
        '.component-text-content'
      ) as HTMLElement | null;
      if (textContent) textContent.textContent = 'Header';
      component.style.color = '';
      component.style.fontWeight = '';
    } else if (component.classList.contains('text-component')) {
      /* Reset text content and clear formula inline styles */
      const textContent = component.querySelector(
        '.component-text-content'
      ) as HTMLElement | null;
      if (textContent) textContent.textContent = 'Text';
      component.style.color = '';
      component.style.fontSize = '';
      component.style.fontWeight = '';
    }

    Canvas.dispatchDesignChange();
    Canvas.historyManager.captureState();

    /* Re-evaluate visibility now that no attribute is bound */
    refreshDeleteVisibility();
  });

  /* ── Set Attribute — opens the modal and applies the chosen attribute ──── */
  modalButton.addEventListener('click', async () => {
    const modalComponent = new ModalComponent();

    if (component.classList.contains('text-component')) {
      const textComponentInstance = new TextComponent();
      await handleComponentClick(
        modalComponent,
        TextComponent.textAttributeConfig,
        component,
        textComponentInstance.updateTextContent
      );
    } else if (component.classList.contains('header-component')) {
      const headerComponentInstance = new HeaderComponent();
      await handleComponentClick(
        modalComponent,
        HeaderComponent.headerAttributeConfig,
        component,
        headerComponentInstance.updateHeaderContent
      );
    } else if (isTableCell) {
      const tableComponentInstance = new TableComponent();
      const cell = component.closest('.table-cell');
      await handleComponentClick(
        modalComponent,
        TableComponent.tableAttributeConfig,
        cell as HTMLElement,
        tableComponentInstance.updateCellContent
      );
    }

    /* After binding, re-check whether the delete button should be visible */
    refreshDeleteVisibility();
  });
}
