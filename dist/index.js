import { Canvas } from './canvas/Canvas.js';
import { Sidebar } from './sidebar/ConfigSidebar.js';
import { CustomizationSidebar } from './sidebar/CustomizationSidebar.js';
import { createSidebar } from './sidebar/CreateSidebar.js';
import { createNavbar } from './navbar/CreateNavbar.js';
import { HTMLGenerator } from './services/HTMLGenerator.js';
import { JSONStorage } from './services/JSONStorage.js';
import {
  showDialogBox,
  showNotification,
  syntaxHighlightCSS,
  syntaxHighlightHTML,
} from './utils/utilityFunctions.js';
import { createZipFile } from './utils/zipGenerator.js';
import { ShortcutManager } from './services/ShortcutManager.js';
import { PreviewPanel } from './canvas/PreviewPanel.js';
document.addEventListener('DOMContentLoaded', () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  const canvas = new Canvas();
  const sidebar = new Sidebar(canvas);
  const htmlGenerator = new HTMLGenerator(canvas);
  const jsonStorage = new JSONStorage();
  const previewPanel = new PreviewPanel();
  createSidebar();
  Canvas.init();
  sidebar.init();
  // Initialize ShortcutManager
  ShortcutManager.init();
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
        const htmlGenerator = new HTMLGenerator(new Canvas());
        // Generate HTML and CSS
        const html = htmlGenerator.generateHTML();
        const css = htmlGenerator.generateCSS();
        console.log('this is html', html);
        // Format the HTML and CSS with syntax highlighting
        const highlightedHTML = syntaxHighlightHTML(html);
        const highlightedCSS = syntaxHighlightCSS(css);
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'export-dialog';
        modal.classList.add('modal');
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        // Create the HTML section
        const htmlSection = document.createElement('div');
        htmlSection.classList.add('modal-section');
        const htmlTitle = document.createElement('h2');
        htmlTitle.textContent = 'HTML';
        const htmlCode = document.createElement('div');
        htmlCode.classList.add('code-block');
        htmlCode.setAttribute('contenteditable', 'true');
        htmlCode.innerHTML = highlightedHTML; // Apply syntax-highlighted HTML
        htmlSection.appendChild(htmlTitle);
        htmlSection.appendChild(htmlCode);
        // Create the CSS section
        const cssSection = document.createElement('div');
        cssSection.classList.add('modal-section');
        const cssTitle = document.createElement('h2');
        cssTitle.textContent = 'CSS';
        const cssCode = document.createElement('div');
        cssCode.classList.add('code-block');
        cssCode.setAttribute('contenteditable', 'true');
        cssCode.innerHTML = highlightedCSS; // Apply syntax-highlighted CSS
        cssSection.appendChild(cssTitle);
        cssSection.appendChild(cssCode);
        // Create Export to ZIP button
        const exportButtonWrapper = document.createElement('div');
        exportButtonWrapper.classList.add('button-wrapper'); // Wrapper for button
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export to ZIP';
        exportButton.classList.add('export-btn');
        exportButton.addEventListener('click', () => {
          const updatedHTML = html;
          const updatedCSS = css;
          const zipFile = createZipFile([
            { name: 'index.html', content: updatedHTML },
            { name: 'styles.css', content: updatedCSS },
          ]);
          const link = document.createElement('a');
          link.href = URL.createObjectURL(zipFile);
          link.download = 'exported-files.zip';
          link.click();
          URL.revokeObjectURL(link.href);
        });
        // Append sections and button wrapper to modal content
        modalContent.appendChild(htmlSection);
        modalContent.appendChild(cssSection);
        modalContent.appendChild(exportButton);
        exportButtonWrapper.appendChild(modalContent);
        // Append modal content to modal
        modal.appendChild(exportButtonWrapper);
        // Append modal to body
        document.body.appendChild(modal);
        // Show the modal
        modal.classList.add('show');
        // Close modal when clicking outside or pressing ESC
        modal.addEventListener('click', event => {
          if (event.target === modal) {
            closeModal(modal);
          }
        });
        document.addEventListener('keydown', event => {
          if (event.key === 'Escape') {
            closeModal(modal);
          }
        });
      });
  // Close modal function
  function closeModal(modal) {
    modal.classList.remove('show');
    modal.classList.add('hide');
    setTimeout(() => modal.remove(), 300); // Remove modal after transition
  }
  // Functionality for "View" button
  (_d = document.getElementById('view-btn')) === null || _d === void 0
    ? void 0
    : _d.addEventListener('click', () => {
        const html = htmlGenerator.generateHTML();
        // Create a full-screen modal
        const fullScreenModal = document.createElement('div');
        fullScreenModal.id = 'preview-modal';
        fullScreenModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #f5f5f5;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
  `;
        // Insert the generated HTML inside an iframe for isolation
        const iframe = document.createElement('iframe');
        iframe.id = 'preview-iframe';
        iframe.style.cssText = `
    width: 97%;
    height: 90%;
    border: none;
    background: #fff;
    margin-right: 20px;
  `;
        iframe.srcdoc = html; // Set the generated HTML as iframe content
        fullScreenModal.appendChild(iframe);
        // Create a close button
        const closeButton = document.createElement('button');
        closeButton.id = 'close-modal-btn';
        closeButton.textContent = '✕';
        closeButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 20px;
    border: none;
    background: none;
    cursor: pointer;
  `;
        fullScreenModal.appendChild(closeButton);
        // Create responsiveness options
        const responsivenessContainer = document.createElement('div');
        responsivenessContainer.style.cssText = `
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  `;
        const sizes = [
          {
            icon: 'dist/icons/mobile.png',
            title: 'Desktop',
            width: '375px',
            height: '90%',
          },
          {
            icon: 'dist/icons/tablet.png',
            title: 'Tablet',
            width: '768px',
            height: '90%',
          },
          {
            icon: 'dist/icons/computer.png',
            title: 'Mobile',
            width: '97%',
            height: '90%',
          },
        ];
        sizes.forEach(size => {
          const button = document.createElement('button');
          button.style.cssText = `
      padding: 5px;
      border: none;
      background: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
          button.title = size.title;
          // Add icon to button
          const icon = document.createElement('img');
          icon.src = size.icon;
          icon.alt = 'Device Icon';
          icon.style.cssText = `
      width: 24px;
      height: 24px;
    `;
          button.appendChild(icon);
          // Add event listener to adjust iframe dimensions
          button.addEventListener('click', () => {
            iframe.style.width = size.width;
            iframe.style.height = size.height;
          });
          responsivenessContainer.appendChild(button);
        });
        fullScreenModal.insertBefore(responsivenessContainer, iframe);
        // Add the modal to the document
        document.body.appendChild(fullScreenModal);
        // Close modal function
        const closeModal = () => {
          setTimeout(() => fullScreenModal.remove(), 300);
          document.removeEventListener('keydown', escKeyListener);
        };
        // Add event listener for close button
        closeButton.addEventListener('click', closeModal);
        // Add event listener for ESC key to close the modal
        const escKeyListener = event => {
          if (event.key === 'Escape') {
            closeModal();
          }
        };
        document.addEventListener('keydown', escKeyListener);
      });
  (_e = document.getElementById('preview-desktop')) === null || _e === void 0
    ? void 0
    : _e.addEventListener('click', () => {
        previewPanel.setPreviewMode('desktop');
      });
  (_f = document.getElementById('preview-tablet')) === null || _f === void 0
    ? void 0
    : _f.addEventListener('click', () => {
        previewPanel.setPreviewMode('tablet');
      });
  (_g = document.getElementById('preview-mobile')) === null || _g === void 0
    ? void 0
    : _g.addEventListener('click', () => {
        previewPanel.setPreviewMode('mobile');
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
