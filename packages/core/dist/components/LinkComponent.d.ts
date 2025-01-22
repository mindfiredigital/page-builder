export declare class LinkComponent {
  private link;
  private isEditing;
  create(href?: string, label?: string): HTMLDivElement;
  getLinkData(): {
    href: string;
    label: string;
  };
  updateLink(href: string, label: string, target?: string): void;
  isInEditMode(): boolean;
}
