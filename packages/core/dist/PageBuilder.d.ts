import './styles/main.css';
export declare class PageBuilder {
  private canvas;
  private sidebar;
  private htmlGenerator;
  private jsonStorage;
  private previewPanel;
  constructor();
  private initializeEventListeners;
  private setupInitialComponents;
  private setupSaveButton;
  private setupResetButton;
  private setupExportHTMLButton;
  private createExportModal;
  private createCloseButton;
  private createCodeSection;
  private createExportToZipButton;
  private setupModalEventListeners;
  private closeModal;
  private setupViewButton;
  private createFullScreenPreviewModal;
  private createPreviewCloseButton;
  private createResponsivenessControls;
  private setupPreviewModeButtons;
  private setupUndoRedoButtons;
}
