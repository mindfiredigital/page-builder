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
  private config;
  private template;
  constructor();
  set editable(value: boolean | null);
  get editable(): boolean | null;
  set brandTitle(value: string | undefined);
  get brandTitle(): string | undefined;
  set initialDesign(value: PageBuilderDesign | null);
  get initialDesign(): PageBuilderDesign | null;
  connectedCallback(): void;
  private hasValidConfig;
  set configData(value: any);
  get configData(): any;
  private initializePageBuilder;
}

export { PageBuilderComponent, PageBuilderDesign };
