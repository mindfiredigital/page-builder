declare class PageBuilder {
  private canvas;
  private sidebar;
  private htmlGenerator;
  private jsonStorage;
  private previewPanel;
  private static headerInitialized;
  private dynamicComponents;
  private initialDesign;
  private editable;
  private brandTitle;
  private showAttributeTab;
  layoutMode: 'absolute' | 'grid';
  private static initialCanvasWidth;
  constructor(
    dynamicComponents?: DynamicComponents,
    initialDesign?: PageBuilderDesign | null,
    editable?: boolean | null,
    brandTitle?: string,
    showAttributeTab?: boolean,
    layoutMode?: 'absolute' | 'grid' | undefined
  );
  static resetHeaderFlag(): void;
  initializeEventListeners(): void;
  setupInitialComponents(): void;
  private createHeaderIfNeeded;
  setupSaveButton(): void;
  setupResetButton(): void;
  /**
   * This function handles the event on clicking the export button
   * It opens up a drop down with 2 options for exporting
   * One is for html export and another is for json object export
   */
  handleExport(): void;
  /**
   * This function handles opening up the modal on clicking export to html option from drop down options
   * This generates expected html and css present on the canvas layout.
   */
  setupExportHTMLButton(): void;
  setupExportPDFButton(): void;
  createExportModal(
    highlightedHTML: string,
    highlightedCSS: string,
    html: string,
    css: string
  ): HTMLDivElement;
  createCloseButton(modal: HTMLElement): HTMLButtonElement;
  createCodeSection(title: string, highlightedContent: string): HTMLDivElement;
  createExportToZipButton(html: string, css: string): HTMLButtonElement;
  setupModalEventListeners(modal: HTMLElement): void;
  closeModal(modal: HTMLElement): void;
  setupViewButton(): void;
  createFullScreenPreviewModal(html: string): HTMLDivElement;
  createPreviewCloseButton(fullScreenModal: HTMLElement): HTMLButtonElement;
  createResponsivenessControls(iframe: HTMLIFrameElement): HTMLDivElement;
  setupPreviewModeButtons(): void;
  setupUndoRedoButtons(): void;
}

declare const PageBuilderCore: PageBuilder;

export { PageBuilder, PageBuilderCore };
