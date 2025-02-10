declare class PageBuilderComponent extends HTMLElement {
  private pageBuilder;
  private initialized;
  private template;
  constructor();
  connectedCallback(): void;
  private initializePageBuilder;
}

export { PageBuilderComponent };
