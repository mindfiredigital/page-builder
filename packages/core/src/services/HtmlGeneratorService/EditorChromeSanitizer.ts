import {
  EDITOR_ATTRS_TO_STRIP,
  EDITOR_CLASSES_TO_REMOVE,
  EDITOR_NODES_SELECTOR,
  SVG_ACCESSIBILITY_SELECTOR,
} from './../../constants';

/* ─── EditorChromeSanitizer ───────────────────────────────────────────────────
   Removes every trace of editor UI from a cloned canvas element before the
   clone's innerHTML is written into the exported HTML file. Operates only on
   the clone — the live DOM is never touched.
   ─────────────────────────────────────────────────────────────────────────── */
export class EditorChromeSanitizer {
  /* ─── Sanitize ──────────────────────────────────────────────────────────────
     Entry point. Strips SVG accessibility nodes, MUI Rating internals, and
     then recurses through the whole tree to remove editor classes, attributes,
     and overlay nodes.
     ─────────────────────────────────────────────────────────────────────────── */
  sanitize(root: HTMLElement): void {
    this.removeSVGAccessibilityNodes(root);
    this.removeMuiRatingInternals(root);
    this.stripNodeRecursive(root);
  }

  /* ─── RemoveSVGAccessibilityNodes ───────────────────────────────────────────
     Deletes <title> and <desc> elements inside SVGs that were added for editor
     screen-reader support but are not wanted in the static export.
     ─────────────────────────────────────────────────────────────────────────── */
  private removeSVGAccessibilityNodes(root: HTMLElement): void {
    root
      .querySelectorAll(SVG_ACCESSIBILITY_SELECTOR)
      .forEach(el => el.remove());
  }

  /* ─── RemoveMuiRatingInternals ──────────────────────────────────────────────
     MUI Rating renders hidden radio inputs and text nodes inside label spans
     for keyboard accessibility. These are editor-only artefacts that produce
     invisible but measurable layout noise in the exported HTML.
     ─────────────────────────────────────────────────────────────────────────── */
  private removeMuiRatingInternals(root: HTMLElement): void {
    root
      .querySelectorAll<HTMLElement>('[class*="MuiRating-label"]')
      .forEach(labelSpan => {
        labelSpan
          .querySelectorAll('input[type="radio"]')
          .forEach(input => input.remove());
        Array.from(labelSpan.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) node.remove();
        });
      });

    root
      .querySelectorAll<HTMLElement>('[class*="MuiRating-visuallyHidden"]')
      .forEach(el => el.remove());
  }

  /* ─── StripNodeRecursive ────────────────────────────────────────────────────
     Depth-first walk that strips editor attributes, removes editor CSS classes,
     deletes matching overlay/control nodes, then recurses into children.
     ─────────────────────────────────────────────────────────────────────────── */
  private stripNodeRecursive(el: HTMLElement): void {
    EDITOR_ATTRS_TO_STRIP.forEach(attr => el.removeAttribute(attr));
    EDITOR_CLASSES_TO_REMOVE.forEach(cls => el.classList.remove(cls));
    el.querySelectorAll(EDITOR_NODES_SELECTOR).forEach(node => node.remove());

    Array.from(el.children).forEach(child => {
      this.stripNodeRecursive(child as HTMLElement);
    });
  }
}
