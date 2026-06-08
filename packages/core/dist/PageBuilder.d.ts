import './styles/index.css';
export declare class PageBuilder {
  private canvas;
  private sidebar;
  private htmlGenerator;
  private jsonStorage;
  private previewPanel;
  private dynamicComponents;
  private initialDesign;
  private editable;
  private brandTitle;
  private showAttributeTab;
  layoutMode: 'absolute' | 'grid';
  private static headerInitialized;
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
  setupExportHTMLButton(): void;
}
