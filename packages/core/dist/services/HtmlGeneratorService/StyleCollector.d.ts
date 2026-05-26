export declare class StyleCollector {
  private readonly styleElement;
  constructor(styleElement: HTMLStyleElement);
  collectHeadStyles(): string;
  generateCSS(): string;
  applyCSS(css: string): void;
  private buildBaseCSS;
  private static readonly INLINE_ONLY_PROPS;
  private collectComputedStyles;
  private collectInlineDecorativeStyles;
  private applyInlineVerticalAlign;
  private isSVGElement;
  private handleSVGElement;
  private generateSVGSpecificSelector;
  private generateUniqueSelector;
}
