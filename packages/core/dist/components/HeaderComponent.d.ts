export declare class HeaderComponent {
  static headerAttributeConfig: ComponentAttribute[];
  private modalComponent;
  constructor();
  create(
    level?: number,
    text?: string,
    headerAttributeConfig?: ComponentAttribute[] | undefined
  ): HTMLElement;
  seedFormulaValues(values: AttributeValues): void;
  updateInputValues(values: AttributeValues): void;
  updateHeaderContent(
    headerElement: HTMLElement,
    attribute: ComponentAttribute
  ): void;
  static restore(container: HTMLElement): void;
}
