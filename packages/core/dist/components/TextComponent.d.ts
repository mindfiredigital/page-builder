export declare class TextComponent {
  private text;
  private static textAttributeConfig;
  private modalComponent;
  constructor(text?: string);
  create(textAttributeConfig?: ComponentAttribute[] | undefined): HTMLElement;
  setText(newText: string): void;
  seedFormulaValues(values: Record<string, any>): void;
  updateInputValues(values: Record<string, any>): void;
  handleTextClick(textComponent: HTMLElement): Promise<void>;
  private findSelectedAttribute;
  private updateTextContent;
}
