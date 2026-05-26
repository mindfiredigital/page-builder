import { Canvas } from '../canvas/Canvas.js';
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
  static handleKeydown(event) {
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
        case 'a': // Select All — scoped to the focused container
          ShortcutManager.handleSelectAll(event);
          break;
        default:
          break;
      }
    }
  }
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
  static handleSelectAll(event) {
    var _a;
    const activeEl = document.activeElement;
    if (!activeEl) return;
    /* Only intercept when focus is inside a contenteditable context */
    const isEditable =
      activeEl.isContentEditable ||
      activeEl.getAttribute('contenteditable') === 'true';
    if (!isEditable) return;
    /* Walk up to find the tightest `.container-component` ancestor */
    const closestContainer = activeEl.closest('.container-component');
    /* If no container ancestor, scope to the editable component itself */
    const scopeEl =
      (_a =
        closestContainer !== null && closestContainer !== void 0
          ? closestContainer
          : activeEl.closest('.editable-component')) !== null && _a !== void 0
        ? _a
        : activeEl;
    if (scopeEl) {
      event.preventDefault();
      const sel = window.getSelection();
      if (!sel) return;
      const range = document.createRange();
      range.selectNodeContents(scopeEl);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}
