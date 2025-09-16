export declare class HeaderComponent {
  static headerAttributeConfig: ComponentAttribute[];
  private modalComponent;
  constructor();
  create(
    level?: number,
    text?: string,
    headerAttributeConfig?: ComponentAttribute[] | undefined
  ): HTMLElement;
  seedFormulaValues(values: Record<string, any>): void;
  updateInputValues(values: Record<string, any>): void;
  updateHeaderContent(
    headerElement: HTMLElement,
    attribute: ComponentAttribute
  ): void;
  static restore(container: HTMLElement): void;
}
