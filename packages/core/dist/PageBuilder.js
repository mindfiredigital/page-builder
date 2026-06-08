import { Canvas } from './canvas/Canvas.js';
import { Sidebar } from './sidebar/ConfigSidebar.js';
import { CustomizationSidebar } from './sidebar/CustomizationSidebar.js';
import { createSidebar } from './sidebar/CreateSidebar.js';
import { HTMLGenerator } from './services/HTMLGenerator.js';
import { JSONStorage } from './services/JSONStorage.js';
import { ShortcutManager } from './services/ShortcutManager.js';
import { PreviewPanel } from './canvas/PreviewPanel.js';
import { createExportModal } from './services/ExportModalService.js';
import { setupExportPDFButton } from './services/ExportPdfService.js';
import { createHeaderIfNeeded } from './utils/pageBuilderNavbarSetup.js';
import { setupExportDropdown } from './utils/exportDropdownSetup.js';
import {
  setupSaveButton,
  setupResetButton,
  setupViewButton,
  setupPreviewModeButtons,
  setupUndoRedoButtons,
} from './utils/pageBuilderButtonSetup.js';
import {
  syntaxHighlightHTML,
  syntaxHighlightCSS,
} from './utils/utilityFunctions.js';
import './styles/main.css';
export class PageBuilder {
  constructor(
    dynamicComponents = { Basic: [], Extra: [], Custom: {} },
    initialDesign = null,
    editable = true,
    brandTitle,
    showAttributeTab,
    layoutMode = 'absolute'
  ) {
    this.dynamicComponents = dynamicComponents;
    this.initialDesign = initialDesign;
    this.canvas = new Canvas();
    this.sidebar = new Sidebar(this.canvas);
    this.htmlGenerator = new HTMLGenerator(this.canvas);
    this.jsonStorage = new JSONStorage();
    this.previewPanel = new PreviewPanel();
    this.editable = editable;
    this.brandTitle = brandTitle;
    this.showAttributeTab = showAttributeTab;
    this.layoutMode = layoutMode;
    this.initializeEventListeners();
  }
  /* Resets the header flag — call during cleanup / unmount */
  static resetHeaderFlag() {
    PageBuilder.headerInitialized = false;
  }
  initializeEventListeners() {
    /* Re-initialise core services on each call */
    this.canvas = new Canvas();
    this.sidebar = new Sidebar(this.canvas);
    this.htmlGenerator = new HTMLGenerator(this.canvas);
    this.jsonStorage = new JSONStorage();
    this.previewPanel = new PreviewPanel();
    this.setupInitialComponents();
    setupSaveButton(this.jsonStorage);
    setupResetButton(this.jsonStorage);
    setupExportDropdown();
    this.setupExportHTMLButton();
    setupExportPDFButton();
    setupViewButton(this.htmlGenerator, this.layoutMode);
    setupPreviewModeButtons(this.previewPanel);
    setupUndoRedoButtons();
  }
  setupInitialComponents() {
    createSidebar(this.dynamicComponents, this.editable);
    Canvas.init(
      this.initialDesign,
      this.editable,
      this.dynamicComponents.Basic,
      this.layoutMode
    );
    this.sidebar.init();
    ShortcutManager.init();
    CustomizationSidebar.init(
      this.dynamicComponents.Custom,
      this.editable,
      this.dynamicComponents.Basic,
      this.showAttributeTab
    );
    createHeaderIfNeeded(this.editable, this.brandTitle, this.showAttributeTab);
    PageBuilder.headerInitialized = true;
  }
  /* Wires the Export HTML button — creates the export modal on click */
  setupExportHTMLButton() {
    const exportButton = document.getElementById('export-html-btn');
    if (!exportButton) return;
    exportButton.addEventListener('click', () => {
      const htmlGenerator = new HTMLGenerator(new Canvas());
      const html = htmlGenerator.generateHTML();
      const css = htmlGenerator.generateCSS();
      const highlightedHTML = syntaxHighlightHTML(html);
      const highlightedCSS = syntaxHighlightCSS(css);
      const modal = createExportModal(
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
PageBuilder.headerInitialized = false;
PageBuilder.initialCanvasWidth = null;
