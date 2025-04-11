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
import './styles/main.css';
import { svgs } from './icons/svgs.js';
export class PageBuilder {
  constructor(dynamicComponents = { Basic: [], Extra: [], Custom: {} }) {
    this.dynamicComponents = dynamicComponents;
    this.canvas = new Canvas();
    this.sidebar = new Sidebar(this.canvas);
    this.htmlGenerator = new HTMLGenerator(this.canvas);
    this.jsonStorage = new JSONStorage();
    this.previewPanel = new PreviewPanel();
    this.initializeEventListeners();
  }
  initializeEventListeners() {
    // document.addEventListener('DOMContentLoaded', () => {
    this.canvas = new Canvas();
    this.sidebar = new Sidebar(this.canvas);
    this.htmlGenerator = new HTMLGenerator(this.canvas);
    this.jsonStorage = new JSONStorage();
    this.previewPanel = new PreviewPanel();
    this.setupInitialComponents();
    this.setupSaveButton();
    this.setupResetButton();
    this.handleExport();
    this.setupExportHTMLButton();
    this.setupViewButton();
    this.setupPreviewModeButtons();
    this.setupUndoRedoButtons();
    // });
  }
  setupInitialComponents() {
    createSidebar(this.dynamicComponents);
    Canvas.init();
    this.sidebar.init();
    ShortcutManager.init();
    CustomizationSidebar.init();
    // Only create header if it doesn't exist
    if (!PageBuilder.headerInitialized) {
      const existingHeader = document.getElementById('page-builder-header');
      if (!existingHeader) {
        const appElement = document.getElementById('app');
        if (appElement && appElement.parentNode) {
          const header = document.createElement('header');
          header.id = 'page-builder-header';
          header.appendChild(createNavbar());
          appElement.parentNode.insertBefore(header, appElement);
          PageBuilder.headerInitialized = true;
        } else {
          console.error('Error: #app not found in the DOM');
        }
      } else {
        PageBuilder.headerInitialized = true;
      }
    }
  }
  setupSaveButton() {
    const saveButton = document.getElementById('save-btn');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        const layoutJSON = Canvas.getState();
        this.jsonStorage.save(layoutJSON);
        showNotification('Saving progress...');
      });
    }
  }
  setupResetButton() {
    const resetButton = document.getElementById('reset-btn');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        showDialogBox(
          'Are you sure you want to reset the layout?',
          () => {
            this.jsonStorage.remove();
            Canvas.clearCanvas();
            showNotification('The saved layout has been successfully reset.');
          },
          () => {
            console.log('Layout reset canceled.');
          }
        );
      });
    }
  }
  /**
   * This function handles the event on clicking the export button
   * It opens up a drop down with 2 options for exporting
   * One is for html export and another is for json object export
   */
  handleExport() {
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      const dropdown = document.createElement('div');
      dropdown.classList.add('export-dropdown');
      // Create Option 1
      const option1 = document.createElement('div');
      option1.textContent = 'HTML';
      option1.classList.add('export-option');
      option1.id = 'export-html-btn';
      // Create Option 2
      const option2 = document.createElement('div');
      option2.textContent = 'JSON';
      option2.classList.add('export-option');
      option2.id = 'export-json-btn';
      dropdown.appendChild(option1);
      dropdown.appendChild(option2);
      exportBtn.appendChild(dropdown);
      exportBtn.addEventListener('click', event => {
        event.stopPropagation();
        dropdown.classList.toggle('visible'); // Toggle dropdown visibility
      });
      // Hide dropdown when clicking outside
      document.addEventListener('click', event => {
        if (!exportBtn.contains(event.target)) {
          dropdown.classList.remove('visible');
        }
      });
    }
  }
  /**
   * This function handles opening up the modal on clicking export to html option from drop down options
   * This generates expected html and css present on the canvas layout.
   */
  setupExportHTMLButton() {
    const exportButton = document.getElementById('export-html-btn');
    if (exportButton) {
      exportButton.addEventListener('click', () => {
        const htmlGenerator = new HTMLGenerator(new Canvas());
        const html = htmlGenerator.generateHTML();
        const css = htmlGenerator.generateCSS();
        const highlightedHTML = syntaxHighlightHTML(html);
        const highlightedCSS = syntaxHighlightCSS(css);
        const modal = this.createExportModal(
          highlightedHTML,
          highlightedCSS,
          html,
          css
        );
        document.body.appendChild(modal);
        modal.classList.add('show');
      });
    }
  }
  createExportModal(highlightedHTML, highlightedCSS, html, css) {
    const modal = document.createElement('div');
    modal.id = 'export-dialog';
    modal.classList.add('modal');
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    const closeButton = this.createCloseButton(modal);
    modalContent.appendChild(closeButton);
    const htmlSection = this.createCodeSection('HTML', highlightedHTML);
    const cssSection = this.createCodeSection('CSS', highlightedCSS);
    const exportButton = this.createExportToZipButton(html, css);
    modalContent.appendChild(htmlSection);
    modalContent.appendChild(cssSection);
    modalContent.appendChild(exportButton);
    const exportButtonWrapper = document.createElement('div');
    exportButtonWrapper.classList.add('button-wrapper');
    exportButtonWrapper.appendChild(modalContent);
    modal.appendChild(exportButtonWrapper);
    this.setupModalEventListeners(modal);
    return modal;
  }
  createCloseButton(modal) {
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.classList.add('close-btn');
    closeButton.addEventListener('click', () => this.closeModal(modal));
    return closeButton;
  }
  createCodeSection(title, highlightedContent) {
    const section = document.createElement('div');
    section.classList.add('modal-section');
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    const codeBlock = document.createElement('div');
    codeBlock.classList.add('code-block');
    codeBlock.setAttribute('contenteditable', 'true');
    codeBlock.innerHTML = highlightedContent;
    section.appendChild(titleElement);
    section.appendChild(codeBlock);
    return section;
  }
  createExportToZipButton(html, css) {
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export to ZIP';
    exportButton.classList.add('export-btn');
    exportButton.addEventListener('click', () => {
      const zipFile = createZipFile([
        { name: 'index.html', content: html },
        { name: 'styles.css', content: css },
      ]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipFile);
      link.download = 'exported-files.zip';
      link.click();
      URL.revokeObjectURL(link.href);
    });
    return exportButton;
  }
  setupModalEventListeners(modal) {
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        this.closeModal(modal);
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this.closeModal(modal);
      }
    });
  }
  closeModal(modal) {
    modal.classList.remove('show');
    modal.classList.add('hide');
    setTimeout(() => modal.remove(), 300);
  }
  setupViewButton() {
    const viewButton = document.getElementById('view-btn');
    if (viewButton) {
      viewButton.addEventListener('click', () => {
        const html = this.htmlGenerator.generateHTML();
        const fullScreenModal = this.createFullScreenPreviewModal(html);
        document.body.appendChild(fullScreenModal);
      });
    }
  }
  createFullScreenPreviewModal(html) {
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
    const iframe = document.createElement('iframe');
    iframe.id = 'preview-iframe';
    iframe.style.cssText = `
      width: 97%;
      height: 90%;
      border: none;
      background: #fff;
      margin-right: 20px;
    `;
    iframe.srcdoc = html;
    fullScreenModal.appendChild(iframe);
    const closeButton = this.createPreviewCloseButton(fullScreenModal);
    fullScreenModal.appendChild(closeButton);
    const responsivenessContainer = this.createResponsivenessControls(iframe);
    fullScreenModal.insertBefore(responsivenessContainer, iframe);
    return fullScreenModal;
  }
  createPreviewCloseButton(fullScreenModal) {
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
    const closeModal = () => {
      setTimeout(() => fullScreenModal.remove(), 300);
      document.removeEventListener('keydown', escKeyListener);
    };
    closeButton.addEventListener('click', closeModal);
    const escKeyListener = event => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', escKeyListener);
    return closeButton;
  }
  createResponsivenessControls(iframe) {
    const responsivenessContainer = document.createElement('div');
    responsivenessContainer.style.cssText = `
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    `;
    const sizes = [
      {
        icon: svgs.mobile,
        title: 'Desktop',
        width: '375px',
        height: '90%',
      },
      {
        icon: svgs.tablet,
        title: 'Tablet',
        width: '768px',
        height: '90%',
      },
      {
        icon: svgs.desktop,
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
      const iconContainer = document.createElement('div');
      iconContainer.innerHTML = size.icon;
      const svgElement = iconContainer.querySelector('svg');
      if (svgElement) {
        svgElement.style.width = '24px';
        svgElement.style.height = '24px';
        svgElement.classList.add('component-icon');
      }
      button.appendChild(iconContainer);
      button.addEventListener('click', () => {
        iframe.style.width = size.width;
        iframe.style.height = size.height;
      });
      responsivenessContainer.appendChild(button);
    });
    return responsivenessContainer;
  }
  setupPreviewModeButtons() {
    const desktopButton = document.getElementById('preview-desktop');
    const tabletButton = document.getElementById('preview-tablet');
    const mobileButton = document.getElementById('preview-mobile');
    if (desktopButton) {
      desktopButton.addEventListener('click', () => {
        this.previewPanel.setPreviewMode('desktop');
      });
    }
    if (tabletButton) {
      tabletButton.addEventListener('click', () => {
        this.previewPanel.setPreviewMode('tablet');
      });
    }
    if (mobileButton) {
      mobileButton.addEventListener('click', () => {
        this.previewPanel.setPreviewMode('mobile');
      });
    }
  }
  setupUndoRedoButtons() {
    const undoButton = document.getElementById('undo-btn');
    const redoButton = document.getElementById('redo-btn');
    if (undoButton) {
      undoButton.addEventListener('click', () => {
        Canvas.historyManager.undo();
      });
    }
    if (redoButton) {
      redoButton.addEventListener('click', () => {
        Canvas.historyManager.redo();
      });
    }
  }
}
PageBuilder.headerInitialized = false;
