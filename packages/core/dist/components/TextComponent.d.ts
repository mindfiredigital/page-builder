export declare class TextComponent {
  private text;
  static textAttributeConfig: ComponentAttribute[];
  private modalComponent;
  constructor(text?: string);
  create(textAttributeConfig?: ComponentAttribute[] | undefined): HTMLElement;
  setText(newText: string): void;
  seedFormulaValues(values: Record<string, any>): void;
  updateInputValues(values: Record<string, any>): void;
  updateTextContent(
    textElement: HTMLElement,
    attribute: ComponentAttribute
  ): void;
  static restore(container: HTMLElement): void;
}
