export declare class HeaderComponent {
  private static headerAttributeConfig;
  private modalComponent;
  constructor();
  create(
    level?: number,
    text?: string,
    headerAttributeConfig?: ComponentAttribute[] | undefined
  ): HTMLElement;
  seedFormulaValues(values: Record<string, any>): void;
  updateInputValues(values: Record<string, any>): void;
  handleHeaderClick(headerComponent: HTMLElement): Promise<void>;
  private findSelectedAttribute;
  private updateHeaderContent;
  static restore(container: HTMLElement): void;
}
