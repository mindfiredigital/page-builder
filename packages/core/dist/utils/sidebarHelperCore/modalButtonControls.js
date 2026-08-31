var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Canvas } from '../../canvas/Canvas.js';
import { ModalComponent } from '../../components/ModalManager.js';
import { TextComponent } from '../../components/TextComponent.js';
import { HeaderComponent } from '../../components/HeaderComponent.js';
import { TableComponent } from '../../components/TableComponent.js';
import { handleComponentClick } from '../componentClickManager.js';
/* Appends "Set Attribute" and "Delete Attribute" buttons to the functions panel */
export function populateModalButton(component, functionsPanel, editable) {
    if (editable === false)
        return;
    const componentType = component.classList[0].replace('-component', '');
    /* Table cells store the attribute on the parent .table-cell, not the clicked content span */
    const isTableCell = component.classList.contains('table-cell-content');
    const attributeTarget = isTableCell
        ? component.closest('.table-cell')
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
    const refreshDeleteVisibility = () => {
        deleteAttributeButton.style.display = (attributeTarget === null || attributeTarget === void 0 ? void 0 : attributeTarget.hasAttribute('data-attribute-key'))
            ? 'block'
            : 'none';
    };
    refreshDeleteVisibility();
    deleteAttributeButton.addEventListener('click', () => {
        if (!attributeTarget)
            return;
        /* Strip binding attributes from the target element */
        attributeTarget.removeAttribute('data-attribute-key');
        attributeTarget.removeAttribute('data-attribute-type');
        if (isTableCell) {
            /* Reset cell text and clear formula inline styles */
            const textContentOfCell = attributeTarget.querySelector('.table-cell-content');
            if (textContentOfCell)
                textContentOfCell.textContent = '';
            attributeTarget.style.color = '';
            attributeTarget.style.fontSize = '';
            attributeTarget.style.fontWeight = '';
        }
        else if (component.classList.contains('header-component')) {
            /* Reset header text and clear formula inline styles */
            const textContent = component.querySelector('.component-text-content');
            if (textContent)
                textContent.textContent = 'Header';
            component.style.color = '';
            component.style.fontWeight = '';
        }
        else if (component.classList.contains('text-component')) {
            /* Reset text content and clear formula inline styles */
            const textContent = component.querySelector('.component-text-content');
            if (textContent)
                textContent.textContent = 'Text';
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
    modalButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        const modalComponent = new ModalComponent();
        if (component.classList.contains('text-component')) {
            const textComponentInstance = new TextComponent();
            yield handleComponentClick(modalComponent, TextComponent.textAttributeConfig, component, textComponentInstance.updateTextContent);
        }
        else if (component.classList.contains('header-component')) {
            const headerComponentInstance = new HeaderComponent();
            yield handleComponentClick(modalComponent, HeaderComponent.headerAttributeConfig, component, headerComponentInstance.updateHeaderContent);
        }
        else if (isTableCell) {
            const tableComponentInstance = new TableComponent();
            const cell = component.closest('.table-cell');
            yield handleComponentClick(modalComponent, TableComponent.tableAttributeConfig, cell, tableComponentInstance.updateCellContent);
        }
        /* After binding, re-check whether the delete button should be visible */
        refreshDeleteVisibility();
    }));
}
