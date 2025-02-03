declare class PageBuilderComponent extends HTMLElement {
  private pageBuilder;
  private initialized;
  constructor();
  connectedCallback(): void;
  private initializePageBuilder;
  disconnectedCallback(): void;
}

export { PageBuilderComponent };
