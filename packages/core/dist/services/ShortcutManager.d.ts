export declare class ShortcutManager {
  /**
   * Initializes keyboard shortcuts.
   */
  static init(): void;
  /**
   * Handles keydown events for shortcuts.
   * @param event - The keyboard event.
   */
  private static handleKeydown;
  /**
   * Ctrl+A handler that scopes the selection to the nearest ancestor
   * `.container-component` when the active element is inside one.
   *
   * Behaviour:
   *   1. If focus is inside a `.container-component`, select all DOM content
   *      of THAT container only (not sibling containers).
   *   2. If focus is on a plain editable component outside any container,
   *      scope to that component.
   *   3. Otherwise fall through to the default browser select-all.
   */
  private static handleSelectAll;
}
