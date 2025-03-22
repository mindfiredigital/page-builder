declare class PageBuilder {
  private canvas;
  private sidebar;
  private htmlGenerator;
  private jsonStorage;
  private previewPanel;
  private static headerInitialized;
  private dynamicComponents;
  constructor(dynamicComponents?: DynamicComponents);
  initializeEventListeners(): void;
  setupInitialComponents(): void;
  setupSaveButton(): void;
  setupResetButton(): void;
  setupExportHTMLButton(): void;
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
