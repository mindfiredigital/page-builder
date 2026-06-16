export declare class TextComponent {
    private text;
    static textAttributeConfig: ComponentAttribute[];
    private modalComponent;
    constructor(text?: string);
    create(textAttributeConfig?: ComponentAttribute[] | undefined): HTMLElement;
    setText(newText: string): void;
    seedFormulaValues(values: AttributeValues): void;
    updateInputValues(values: AttributeValues): void;
    updateTextContent(textElement: HTMLElement, attribute: ComponentAttribute): void;
    static restore(container: HTMLElement): void;
}
