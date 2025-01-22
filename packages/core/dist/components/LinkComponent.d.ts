export declare class LinkComponent {
  private link;
  private isEditing;
  /**
   * Creates a link component with editing functionality.
   * Users can edit the link's URL and choose whether it opens in the same tab or a new tab.
   * @param href - The initial URL for the link (default: '#').
   * @param label - The text displayed for the link (default: 'Click Here').
   * @returns A div element containing the link, edit button, and edit form.
   */
  create(href?: string, label?: string): HTMLDivElement;
  /**
   * Gets the current data of the link, including the URL, label, and target behavior.
   * @returns An object containing href, label, and target.
   */
  getLinkData(): {
    href: string;
    label: string;
    target: string;
  };
  /**
   * Updates the link's URL, label, and target programmatically.
   * @param href - The new URL for the link.
   * @param label - The new text displayed for the link.
   * @param target - The target behavior ('_self' for the same tab, '_blank' for a new tab).
   */
  updateLink(href: string, label: string, target?: string): void;
  /**
   * Checks if the component is currently in editing mode.
   * @returns A boolean indicating whether the component is in editing mode.
   */
  isInEditMode(): boolean;
}
