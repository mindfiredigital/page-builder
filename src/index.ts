import { Canvas } from './canvas/Canvas';
import { Sidebar } from './sidebar/ConfigSidebar';
import { CustomizationSidebar } from './sidebar/CustomizationSidebar';
import { createSidebar } from './sidebar/CreateSidebar';
import { createNavbar } from './navbar/CreateNavbar';
import { HTMLGenerator } from './services/HTMLGenerator';
import { JSONStorage } from './services/JSONStorage';
import {
  showDialogBox,
  showNotification,
  syntaxHighlightCSS,
  syntaxHighlightHTML,
} from './utils/utilityFunctions';

document.addEventListener('DOMContentLoaded', () => {
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
  document.getElementById('save-btn')?.addEventListener('click', () => {
    const layoutJSON = Canvas.getState();
    jsonStorage.save(layoutJSON);
    showNotification('Saving progress...');
  });
  document.getElementById('reset-btn')?.addEventListener('click', () => {
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

  document.getElementById('export-html-btn')?.addEventListener('click', () => {
    const htmlGenerator = new HTMLGenerator(new Canvas());

    // Generate HTML and CSS
    const html = htmlGenerator.generateHTML();
    const css = htmlGenerator.generateCSS();
    // Format the HTML and CSS with syntax highlighting
    const highlightedHTML = syntaxHighlightHTML(html);
    const highlightedCSS = syntaxHighlightCSS(css);
    // Create modal container
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'export-dialog';
    modal.classList.add('modal');

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Create the HTML and CSS sections
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

    // Append sections to modal content
    modalContent.appendChild(htmlSection);
    modalContent.appendChild(cssSection);

    // Append modal content to modal
    modal.appendChild(modalContent);

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
  function closeModal(modal: HTMLElement) {
    modal.classList.remove('show');
    modal.classList.add('hide');
    setTimeout(() => modal.remove(), 300); // Remove modal after transition
  }

  // Functionality for "View" button
  document.getElementById('view-btn')?.addEventListener('click', () => {
    const html = htmlGenerator.generateHTML();

    // Create a full-screen modal
    const fullScreenModal = document.createElement('div');
    fullScreenModal.id = 'preview-modal';

    // Insert the generated HTML
    fullScreenModal.innerHTML = html;

    // Add the modal to the document
    // Create a close button
    const closeButton = document.createElement('button');
    closeButton.id = 'close-modal-btn';
    closeButton.textContent = '✕';

    // Append the close button to the modal
    fullScreenModal.appendChild(closeButton);

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
    const escKeyListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', escKeyListener);
  });

  document.getElementById('preview-desktop')?.addEventListener('click', () => {
    const canvas = document.getElementById('canvas')!;
    canvas.classList.remove('preview-tablet', 'preview-mobile');
    canvas.classList.add('preview-desktop');
  });

  document.getElementById('preview-tablet')?.addEventListener('click', () => {
    const canvas = document.getElementById('canvas')!;
    canvas.classList.remove('preview-desktop', 'preview-mobile');
    canvas.classList.add('preview-tablet');
  });

  document.getElementById('preview-mobile')?.addEventListener('click', () => {
    const canvas = document.getElementById('canvas')!;
    canvas.classList.remove('preview-desktop', 'preview-tablet');
    canvas.classList.add('preview-mobile');
  });

  //Functionality for undo button
  document.getElementById('undo-btn')?.addEventListener('click', () => {
    Canvas.historyManager.undo();
  });

  //Functionality for redo button
  document.getElementById('redo-btn')?.addEventListener('click', () => {
    Canvas.historyManager.redo();
  });
});
