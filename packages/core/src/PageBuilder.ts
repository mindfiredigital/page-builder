import { Canvas } from './canvas/Canvas';
import { Sidebar } from './sidebar/ConfigSidebar';
import { CustomizationSidebar } from './sidebar/CustomizationSidebar';
import { createSidebar } from './sidebar/CreateSidebar';
import { HTMLGenerator } from './services/HTMLGenerator';
import { JSONStorage } from './services/JSONStorage';
import { ShortcutManager } from './services/ShortcutManager';
import { PreviewPanel } from './canvas/PreviewPanel';
import { createExportModal } from './services/ExportModalService';
import { setupExportPDFButton } from './services/ExportPdfService';
import { createHeaderIfNeeded } from './utils/pageBuilderNavbarSetup';
import { setupExportDropdown } from './utils/exportDropdownSetup';
import { MobileResponsiveManager } from './utils/MobileResponsiveManager';
import {
  setupSaveButton,
  setupResetButton,
  setupViewButton,
  setupPreviewModeButtons,
  setupUndoRedoButtons,
} from './utils/pageBuilderButtonSetup';
import {
  syntaxHighlightHTML,
  syntaxHighlightCSS,
} from './utils/utilityFunctions';
import './styles/index.css';

export class PageBuilder {
  private canvas: Canvas;
  private sidebar: Sidebar;
  private htmlGenerator: HTMLGenerator;
  private jsonStorage: JSONStorage;
  private previewPanel: PreviewPanel;
  private dynamicComponents;
  private initialDesign: PageBuilderDesign | null;
  private editable: boolean | null;
  private brandTitle: string | undefined;
  private showAttributeTab: boolean | undefined;
  public layoutMode: 'absolute' | 'grid';

  private static headerInitialized: boolean = false;
  private static initialCanvasWidth: number | null = null;

  constructor(
    dynamicComponents: DynamicComponents = { Basic: [], Extra: [], Custom: {} },
    initialDesign: PageBuilderDesign | null = null,
    editable: boolean | null = true,
    brandTitle?: string,
    showAttributeTab?: boolean,
    layoutMode: 'absolute' | 'grid' | undefined = 'grid'
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
  public static resetHeaderFlag(): void {
    PageBuilder.headerInitialized = false;
  }

  public initializeEventListeners(): void {
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

  public setupInitialComponents(): void {
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

    /* Mobile responsive setup — grid layout only, runs after all DOM is ready */
    MobileResponsiveManager.init(this.layoutMode, this.editable);
  }

  /* Applies a new design to the already-mounted canvas, live — the same
     mechanism undo/redo uses. This is the seam a live-sync client (e.g. a
     sidecar push) calls to reflect an externally-made edit in an
     already-open tab, without a full reload. */
  public applyDesign(design: PageBuilderDesign): void {
    Canvas.restoreState(design);
  }

  /* Returns the current design as final HTML/CSS strings, without any DOM
     modal/button involved. Reuses the same generator the export button
     uses — this is the seam headless callers (e.g. the CLI's `render`
     command) call directly via a real (possibly headless) browser. */
  public generateOutput(): { html: string; css: string } {
    const htmlGenerator = new HTMLGenerator(new Canvas());
    return {
      html: htmlGenerator.generateHTML(),
      css: htmlGenerator.generateCSS(),
    };
  }

  /* Wires the Export HTML button — creates the export modal on click */
  public setupExportHTMLButton(): void {
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
