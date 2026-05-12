export declare class RichTextComponent {
  private static blockCounter;
  private root;
  private activePopover;
  private activeBlock;
  private boundCloseHandler;
  private static readonly BLOCK_TYPES;
  private generateBlockId;
  create(): HTMLElement;
  private createBlock;
  private createBlockContent;
  private createTextContent;
  private createHeadingContent;
  private createImageContent;
  private createListContent;
  private createCodeContent;
  private createQuoteContent;
  private createDelimiterContent;
  private createRawHtmlContent;
  private createWarningContent;
  private createChecklistContent;
  private createChecklistItem;
  private buildAddPopover;
  private toggleAddPopover;
  private hidePopover;
  private insertBlock;
  static restore(_container: HTMLElement): void;
}
