import { Canvas } from './canvas/Canvas.js';
import { Sidebar } from './sidebar/ConfigSidebar.js';
import { CustomizationSidebar } from './sidebar/CustomizationSidebar.js';
import { createSidebar } from './sidebar/CreateSidebar.js';
import { createNavbar } from './navbar/CreateNavbar.js';
import { HTMLGenerator } from './services/HTMLGenerator.js';
import { JSONStorage } from './services/JSONStorage.js';
import { showDialogBox, showNotification } from './utils/utilityFunctions.js';
document.addEventListener('DOMContentLoaded', () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  const canvas = new Canvas();
  const sidebar = new Sidebar(canvas);
  const htmlGenerator = new HTMLGenerator(canvas);
  const jsonStorage = new JSONStorage();
  createSidebar();
  Canvas.init();
  sidebar.init();
  CustomizationSidebar.init();
  const header = document.createElement('header');
  header.appendChild(createNavbar());
  document.body.insertBefore(header, document.getElementById('app'));
  // Additional event listeners for exporting or saving
  (_a = document.getElementById('save-btn')) === null || _a === void 0
    ? void 0
    : _a.addEventListener('click', () => {
        const layoutJSON = Canvas.getState();
        jsonStorage.save(layoutJSON);
        showNotification('Saving progress...');
      });
  (_b = document.getElementById('reset-btn')) === null || _b === void 0
    ? void 0
    : _b.addEventListener('click', () => {
        // Show the dialog with a custom message
        showDialogBox(
          'Are you sure you want to reset the layout?', // Message
          () => {
            // Action if the user confirms (clicks 'Yes')
            jsonStorage.remove();
            Canvas.clearCanvas();
            showNotification('The saved layout has been successfully reset.');
          },
          () => {
            // Action if the user cancels (clicks 'No')
            console.log('Layout reset canceled.');
          }
        );
      });
  (_c = document.getElementById('export-html-btn')) === null || _c === void 0
    ? void 0
    : _c.addEventListener('click', () => {
        const html = htmlGenerator.generateHTML();
        console.log('Generated HTML:', html);
      });
  // Functionality for "View" button
  (_d = document.getElementById('view-btn')) === null || _d === void 0
    ? void 0
    : _d.addEventListener('click', () => {
        const html = htmlGenerator.generateHTML();
        // Create a full-screen modal
        const fullScreenModal = document.createElement('div');
        fullScreenModal.id = 'preview-modal';
        fullScreenModal.style.position = 'fixed';
        fullScreenModal.style.top = '0';
        fullScreenModal.style.left = '0';
        fullScreenModal.style.width = '100%';
        fullScreenModal.style.height = '100%';
        fullScreenModal.style.backgroundColor = 'white';
        fullScreenModal.style.zIndex = '9999';
        fullScreenModal.style.overflow = 'auto';
        // Insert the generated HTML
        fullScreenModal.innerHTML = html;
        // Add the modal to the document
        document.body.appendChild(fullScreenModal);
        // Add event listener for ESC key to close the modal
        const escKeyListener = event => {
          if (event.key === 'Escape') {
            fullScreenModal.remove();
            document.removeEventListener('keydown', escKeyListener);
          }
        };
        document.addEventListener('keydown', escKeyListener);
      });
  (_e = document.getElementById('preview-desktop')) === null || _e === void 0
    ? void 0
    : _e.addEventListener('click', () => {
        const canvas = document.getElementById('canvas');
        canvas.classList.remove('preview-tablet', 'preview-mobile');
        canvas.classList.add('preview-desktop');
      });
  (_f = document.getElementById('preview-tablet')) === null || _f === void 0
    ? void 0
    : _f.addEventListener('click', () => {
        const canvas = document.getElementById('canvas');
        canvas.classList.remove('preview-desktop', 'preview-mobile');
        canvas.classList.add('preview-tablet');
      });
  (_g = document.getElementById('preview-mobile')) === null || _g === void 0
    ? void 0
    : _g.addEventListener('click', () => {
        const canvas = document.getElementById('canvas');
        canvas.classList.remove('preview-desktop', 'preview-tablet');
        canvas.classList.add('preview-mobile');
      });
  //Functionality for undo button
  (_h = document.getElementById('undo-btn')) === null || _h === void 0
    ? void 0
    : _h.addEventListener('click', () => {
        Canvas.historyManager.undo();
      });
  //Functionality for redo button
  (_j = document.getElementById('redo-btn')) === null || _j === void 0
    ? void 0
    : _j.addEventListener('click', () => {
        Canvas.historyManager.redo();
      });
});
