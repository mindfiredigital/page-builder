declare class PageBuilderComponent extends HTMLElement {
  private pageBuilder;
  private initialized;
  private config;
  private template;
  constructor();
  static get observedAttributes(): string[];
  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void;
  connectedCallback(): void;
  private initializePageBuilder;
}

export { PageBuilderComponent };
