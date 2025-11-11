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
import { createZipFile } from './utils/zipGenerator';
import { ShortcutManager } from './services/ShortcutManager';
import { PreviewPanel } from './canvas/PreviewPanel';
import './styles/main.css';
import { svgs } from './icons/svgs';
import html2pdf from 'html2pdf.js';

export class PageBuilder {
  private canvas: Canvas;
  private sidebar: Sidebar;
  private htmlGenerator: HTMLGenerator;
  private jsonStorage: JSONStorage;
  private previewPanel: PreviewPanel;
  private static headerInitialized = false;
  private dynamicComponents;
  private initialDesign: PageBuilderDesign | null;
  private editable: boolean | null;
  private brandTitle: string | undefined;
  private showAttributeTab: boolean | undefined;
  public layoutMode: 'absolute' | 'grid';
  private static initialCanvasWidth: number | null = null;

  constructor(
    dynamicComponents: DynamicComponents = {
      Basic: [],
      Extra: [],
      Custom: {},
    },
    initialDesign: PageBuilderDesign | null = null,
    editable: boolean | null = true,
    brandTitle?: string,
    showAttributeTab?: boolean,
    layoutMode: 'absolute' | 'grid' | undefined = 'absolute'
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

  // Static method to reset header flag (called during cleanup)
  public static resetHeaderFlag() {
    PageBuilder.headerInitialized = false;
  }

  public initializeEventListeners() {
    // Re-initialize core components
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
    this.setupExportPDFButton();
    this.setupViewButton();
    this.setupPreviewModeButtons();
    this.setupUndoRedoButtons();
  }

  public setupInitialComponents() {
    createSidebar(this.dynamicComponents, this.editable);

    // Pass initial design to Canvas.init
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

    // Create header logic - improved to handle re-initialization
    this.createHeaderIfNeeded();
  }

  private createHeaderIfNeeded() {
    const existingHeader = document.getElementById('page-builder-header');

    // Only create header if it doesn't exist
    if (!existingHeader) {
      const appElement = document.getElementById('app');
      if (appElement && appElement.parentNode) {
        const header = document.createElement('header');
        header.id = 'page-builder-header';
        header.appendChild(
          createNavbar(this.editable, this.brandTitle, this.showAttributeTab)
        );
        appElement.parentNode.insertBefore(header, appElement);
        PageBuilder.headerInitialized = true;
      } else {
        console.error('Error: #app not found in the DOM');
      }
    } else {
      // Header exists, mark as initialized
      PageBuilder.headerInitialized = true;
    }
  }

  // Rest of your methods remain the same...
  public setupSaveButton() {
    const saveButton = document.getElementById('save-btn');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        const layoutJSON = Canvas.getState();
        this.jsonStorage.save(layoutJSON);
        showNotification('Saving progress...');
      });
    }
  }

  public setupResetButton() {
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
  public handleExport() {
    const exportBtn = document.getElementById('export-btn');

    if (exportBtn) {
      const dropdown = document.createElement('div');
      dropdown.classList.add('export-dropdown');

      const option1 = document.createElement('div');
      option1.textContent = 'HTML';
      option1.classList.add('export-option');
      option1.id = 'export-html-btn';

      const option2 = document.createElement('div');
      option2.textContent = 'PDF';
      option2.classList.add('export-option');
      option2.id = 'export-pdf-btn';

      dropdown.appendChild(option1);
      dropdown.appendChild(option2);

      exportBtn.appendChild(dropdown);

      exportBtn.addEventListener('click', event => {
        event.stopPropagation();
        dropdown.classList.toggle('visible');
      });

      // Hide dropdown when clicking outside
      document.addEventListener('click', event => {
        if (!exportBtn.contains(event.target as Node)) {
          dropdown.classList.remove('visible');
        }
      });
    }
  }

  /**
   * This function handles opening up the modal on clicking export to html option from drop down options
   * This generates expected html and css present on the canvas layout.
   */
  public setupExportHTMLButton() {
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

  public setupExportPDFButton() {
    const exportButton = document.getElementById('export-pdf-btn');
    if (exportButton) {
      exportButton.addEventListener('click', async () => {
        showNotification('Generating PDF for download...');
        await new Promise(resolve => setTimeout(resolve, 1500));

        const tempContainer = document.createElement('div');

        try {
          const worker = html2pdf();
          if (!worker) {
            showNotification('html2pdf library not loaded');
            return;
          }

          const htmlGenerator = new HTMLGenerator(new Canvas());
          const contentHTML = htmlGenerator.generateHTML();
          let css = htmlGenerator.generateCSS();

          const canvasElement = document.getElementById('canvas');
          if (!canvasElement) return;

          const contentWidth = canvasElement.scrollWidth;
          const contentHeight = canvasElement.scrollHeight;

          const A4_WIDTH_PX = 794;
          const A4_HEIGHT_PX = 1123;
          const MARGIN_BUFFER_PX = 40;
          const QUALITY_SCALE = 3;

          const widthScaleFactor =
            (A4_WIDTH_PX - MARGIN_BUFFER_PX) / contentWidth;
          const heightScaleFactor =
            (A4_HEIGHT_PX - MARGIN_BUFFER_PX) / contentHeight;

          const SHRINK_FACTOR = Math.min(
            widthScaleFactor,
            heightScaleFactor,
            1
          );
          const FINAL_HTML2CANVAS_SCALE = SHRINK_FACTOR * QUALITY_SCALE;

          // 3. APPLY CLEANUP CSS
          css = css.replace(/min-height:\s*100vh/gi, 'min-height: auto');

          const pdfContent = `
            <style>
              ${css}

              /* General Styles for isolated rendering */
              * { box-sizing: border-box; }
              html, body, #pdf-wrapper { 
                margin: 0; padding: 0; 
                overflow: visible !important; 
                font-family: Arial, sans-serif !important; 
                background-color: white !important; 
              }

              /* Set wrapper to the full, non-scaled content size */
              #pdf-wrapper {
                width: ${contentWidth}px !important; 
                height: ${contentHeight}px !important; // Use full scrollable height
                overflow: visible !important; 
                transform: none !important; 
              }

              #canvas.home {
                width: ${contentWidth}px !important;
                height: ${contentHeight}px !important; // Use full scrollable height
                min-height: auto !important; 
                transform: none !important; 

                position: relative !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
              }

              /* Prevent breaking elements */
              table, #pdf-wrapper, #canvas.home {
                page-break-inside: avoid !important;
              }
            </style>
            <div id="pdf-wrapper">
              ${contentHTML}
            </div>
          `;

          tempContainer.innerHTML = pdfContent;
          tempContainer.style.cssText = `
                    position: absolute;
                    left: -99999px;
                    top: 0;
                    width: ${contentWidth}px;
                    height: ${contentHeight}px; // Must match inner content size
                    overflow: visible;
                    background-color: white; 
                `;
          document.body.appendChild(tempContainer);

          // Give time for DOM insertion/rendering
          await new Promise(resolve => setTimeout(resolve, 100));

          const sourceElement = tempContainer.querySelector(
            '#pdf-wrapper'
          ) as HTMLElement;

          if (!sourceElement) {
            throw new Error('PDF source element (#pdf-wrapper) not found.');
          }

          // 4. APPLY UNIFIED SCALE TO HTML2CANVAS
          await worker
            .set({
              filename: 'exported_page_download.pdf',
              image: { type: 'png', quality: 1 },
              html2canvas: {
                scale: FINAL_HTML2CANVAS_SCALE, // Scale is now based on the limiting factor (width or height)
                width: contentWidth, // Explicitly tell html2canvas the content width
                height: contentHeight, // Explicitly tell html2canvas the content height
                useCORS: true,
                logging: false,
                backgroundColor: null,
                letterRendering: true,
                allowTaint: true,
              },
              jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
              },
            })
            .from(sourceElement)
            .save();

          showNotification('PDF downloaded successfully!');
        } catch (error) {
          console.error('PDF generation error:', error);
          showNotification('Error generating PDF. Check console for details.');
        } finally {
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
          }
        }
      });
    }
  }
  public createExportModal(
    highlightedHTML: string,
    highlightedCSS: string,
    html: string,
    css: string
  ) {
    const modal = document.createElement('div');
    modal.id = 'export-dialog';
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('export-modal-content');

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

  public createCloseButton(modal: HTMLElement) {
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.classList.add('close-btn');
    closeButton.addEventListener('click', () => this.closeModal(modal));
    return closeButton;
  }

  public createCodeSection(title: string, highlightedContent: string) {
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

  public createExportToZipButton(html: string, css: string) {
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

  public setupModalEventListeners(modal: HTMLElement) {
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

  public closeModal(modal: HTMLElement) {
    modal.classList.remove('show');
    modal.classList.add('hide');
    setTimeout(() => modal.remove(), 300);
  }

  public setupViewButton() {
    const viewButton = document.getElementById('view-btn');
    if (viewButton) {
      viewButton.addEventListener('click', () => {
        const html = this.htmlGenerator.generateHTML();
        const fullScreenModal = this.createFullScreenPreviewModal(html);
        document.body.appendChild(fullScreenModal);
      });
    }
  }

  public createFullScreenPreviewModal(html: string) {
    const fullScreenModal = document.createElement('div');
    fullScreenModal.id = 'preview-modal';
    fullScreenModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      background-color: #ffffff;
    `;

    const iframe = document.createElement('iframe');
    iframe.id = 'preview-iframe';
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: #fff;
    `;
    iframe.srcdoc = html;
    fullScreenModal.appendChild(iframe);

    const closeButton = this.createPreviewCloseButton(fullScreenModal);
    fullScreenModal.appendChild(closeButton);

    const responsivenessContainer = this.createResponsivenessControls(iframe);
    fullScreenModal.insertBefore(responsivenessContainer, iframe);

    return fullScreenModal;
  }

  public createPreviewCloseButton(fullScreenModal: HTMLElement) {
    const closeButton = document.createElement('button');
    closeButton.id = 'close-modal-btn';
    closeButton.innerHTML = svgs.closePreviewBtn;
    closeButton.style.cssText = `
      position: absolute;
      top: 0;
      left:0;
      font-size: 20px;
      border: none;
      background: none;
      font:bold;
      color:black;
      cursor: pointer;
    `;

    const closeModal = () => {
      setTimeout(() => fullScreenModal.remove(), 300);
      document.removeEventListener('keydown', escKeyListener);
    };

    closeButton.addEventListener('click', closeModal);

    const escKeyListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', escKeyListener);

    return closeButton;
  }

  public createResponsivenessControls(iframe: HTMLIFrameElement) {
    const responsivenessContainer = document.createElement('div');
    responsivenessContainer.style.cssText = `
      gap: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid #e2e8f0;
      width: 100%
    `;

    const sizes = [
      {
        icon: svgs.mobile,
        title: 'Desktop',
        width: '375px',
        height: '100%',
      },
      {
        icon: svgs.tablet,
        title: 'Tablet',
        width: '768px',
        height: '100%',
      },
      {
        icon: svgs.desktop,
        title: 'Mobile',
        width: '100%',
        height: '100%',
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
        iframe.style.transition = 'all 0.5s ease';
      });

      responsivenessContainer.appendChild(button);
    });

    return responsivenessContainer;
  }

  public setupPreviewModeButtons() {
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

  public setupUndoRedoButtons() {
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
