import { Canvas } from '../canvas/Canvas';
import { JSONStorage } from '../services/JSONStorage';
import { HTMLGenerator } from '../services/HTMLGenerator';
import { PreviewPanel } from '../canvas/PreviewPanel';
import { showDialogBox, showNotification } from './utilityFunctions';
import { createFullScreenPreviewModal } from './previewModalBuilder';

/* Wires the Save button to persist the current canvas state */
export function setupSaveButton(jsonStorage: JSONStorage): void {
  const saveButton = document.getElementById('save-btn');
  if (!saveButton) return;

  saveButton.addEventListener('click', () => {
    const layoutJSON = Canvas.getState();
    jsonStorage.save(layoutJSON);
    showNotification('Saving progress...');
  });
}

/* Wires the Reset button to confirm then clear the saved layout */
export function setupResetButton(jsonStorage: JSONStorage): void {
  const resetButton = document.getElementById('reset-btn');
  if (!resetButton) return;

  resetButton.addEventListener('click', () => {
    showDialogBox(
      'Are you sure you want to reset the layout?',
      () => {
        jsonStorage.remove();
        Canvas.clearCanvas();
        showNotification('The saved layout has been successfully reset.');
      },
      () => {
        console.log('Layout reset canceled.');
      }
    );
  });
}

/* Wires the View button to open a full-screen preview modal */
export function setupViewButton(
  htmlGenerator: HTMLGenerator,
  layoutMode: 'absolute' | 'grid'
): void {
  const viewButton = document.getElementById('view-btn');
  if (!viewButton) return;

  viewButton.addEventListener('click', () => {
    const html = htmlGenerator.generateHTML();
    const fullScreenModal = createFullScreenPreviewModal(html, layoutMode);
    document.body.appendChild(fullScreenModal);
  });
}

/* Wires the desktop / tablet / mobile preview toggle buttons */
export function setupPreviewModeButtons(previewPanel: PreviewPanel): void {
  document.getElementById('preview-desktop')?.addEventListener('click', () => {
    previewPanel.setPreviewMode('desktop');
  });
  document.getElementById('preview-tablet')?.addEventListener('click', () => {
    previewPanel.setPreviewMode('tablet');
  });
  document.getElementById('preview-mobile')?.addEventListener('click', () => {
    previewPanel.setPreviewMode('mobile');
  });
}

/* Wires the Undo and Redo buttons to the history manager */
export function setupUndoRedoButtons(): void {
  document.getElementById('undo-btn')?.addEventListener('click', () => {
    Canvas.historyManager.undo();
  });
  document.getElementById('redo-btn')?.addEventListener('click', () => {
    Canvas.historyManager.redo();
  });
}
