import { Canvas } from '../canvas/Canvas';

export class ShortcutManager {
  /**
   * Initializes keyboard shortcuts.
   */
  static init() {
    document.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Handles keydown events for shortcuts.
   * @param event - The keyboard event.
   */
  private static handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'z': // Undo
          event.preventDefault();
          Canvas.historyManager.undo();
          break;

        case 'y': // Redo
          event.preventDefault();
          Canvas.historyManager.redo();
          break;

        default:
          break;
      }
    }
  }
}
