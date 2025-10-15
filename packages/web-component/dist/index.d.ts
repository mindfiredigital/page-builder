interface PageBuilderDesign {
  pages?: Array<{
    id: string;
    components: Array<{
      type: string;
      id: string;
      props: Record<string, any>;
    }>;
  }>;
  [key: string]: any;
}
declare class PageBuilderComponent extends HTMLElement {
  private pageBuilder;
  private initialized;
  private _initialDesign;
  private _editable;
  private _brandTitle?;
  private _showAttributeTab?;
  private config;
  private template;
  constructor();
  set editable(value: boolean | null);
  get editable(): boolean | null;
  set brandTitle(value: string | undefined);
  get brandTitle(): string | undefined;
  set showAttributeTab(value: boolean | undefined);
  get showAttributeTab(): boolean | undefined;
  set initialDesign(value: PageBuilderDesign | null);
  get initialDesign(): PageBuilderDesign | null;
  set configData(value: any);
  get configData(): any;
  connectedCallback(): void;
  private initializePageBuilder;
}

export { PageBuilderComponent, PageBuilderDesign };
