interface LinkData {
  href: string;
  label: string;
}
export declare class LinkComponent {
  private link;
  private isEditing;
  create(href?: string, label?: string): HTMLDivElement;
  getLinkData(): LinkData;
  updateLink(href: string, label: string): void;
  isInEditMode(): boolean;
}
export {};
