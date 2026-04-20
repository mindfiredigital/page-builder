import { Canvas } from '../canvas/Canvas.js';
import { showDialogBox, showNotification } from './utilityFunctions.js';
import { createFullScreenPreviewModal } from './previewModalBuilder.js';
/* Wires the Save button to persist the current canvas state */
export function setupSaveButton(jsonStorage) {
  const saveButton = document.getElementById('save-btn');
  if (!saveButton) return;
  saveButton.addEventListener('click', () => {
    const layoutJSON = Canvas.getState();
    jsonStorage.save(layoutJSON);
    showNotification('Saving progress...');
  });
}
/* Wires the Reset button to confirm then clear the saved layout */
export function setupResetButton(jsonStorage) {
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
export function setupViewButton(htmlGenerator, layoutMode) {
  const viewButton = document.getElementById('view-btn');
  if (!viewButton) return;
  viewButton.addEventListener('click', () => {
    const html = htmlGenerator.generateHTML();
    const fullScreenModal = createFullScreenPreviewModal(html, layoutMode);
    document.body.appendChild(fullScreenModal);
  });
}
/* Wires the desktop / tablet / mobile preview toggle buttons */
export function setupPreviewModeButtons(previewPanel) {
  var _a, _b, _c;
  (_a = document.getElementById('preview-desktop')) === null || _a === void 0
    ? void 0
    : _a.addEventListener('click', () => {
        previewPanel.setPreviewMode('desktop');
      });
  (_b = document.getElementById('preview-tablet')) === null || _b === void 0
    ? void 0
    : _b.addEventListener('click', () => {
        previewPanel.setPreviewMode('tablet');
      });
  (_c = document.getElementById('preview-mobile')) === null || _c === void 0
    ? void 0
    : _c.addEventListener('click', () => {
        previewPanel.setPreviewMode('mobile');
      });
}
/* Wires the Undo and Redo buttons to the history manager */
export function setupUndoRedoButtons() {
  var _a, _b;
  (_a = document.getElementById('undo-btn')) === null || _a === void 0
    ? void 0
    : _a.addEventListener('click', () => {
        Canvas.historyManager.undo();
      });
  (_b = document.getElementById('redo-btn')) === null || _b === void 0
    ? void 0
    : _b.addEventListener('click', () => {
        Canvas.historyManager.redo();
      });
}
