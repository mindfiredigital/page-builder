import { Canvas } from '../canvas/Canvas';
import {
  EditorChromeSanitizer,
  HtmlShellBuilder,
  StyleCollector,
  SvgStamper,
} from './HtmlGeneratorService';

/* ─── HtmlGenerator ───────────────────────────────────────────────────────────
   Orchestrator for the full HTML export pipeline. Delegates each phase to a
   focused collaborator class and sequences them in the correct order:

     Phase 1 — StyleCollector.collectHeadStyles()
               Harvest existing <style> sheets from <head>.

     Phase 2 — SvgStamper.stampSVGDimensions()
               Write measured pixel dimensions onto live <svg> nodes so the
               clone carries exact sizes into the exported file.

     Phase 3 — canvas.cloneNode()
               Deep-clone the canvas element with the stamped attributes in place.

     Phase 4 — EditorChromeSanitizer.sanitize()
               Strip all editor-only nodes, classes, and attributes from clone.

     Phase 5 — SvgStamper.restoreSVGStamps()
               Undo the dimension stamps on the original live DOM.

     Phase 6 — StyleCollector.generateCSS()
               Walk the live canvas and emit a computed-style stylesheet.

     Phase 7 — HtmlShellBuilder.build()
               Wrap everything in a complete <!DOCTYPE html> document.
   ─────────────────────────────────────────────────────────────────────────── */
export class HTMLGenerator {
  private readonly canvas: Canvas;
  private readonly styleElement: HTMLStyleElement;

  private readonly styleCollector: StyleCollector;
  private readonly svgStamper: SvgStamper;
  private readonly sanitizer: EditorChromeSanitizer;
  private readonly shellBuilder: HtmlShellBuilder;

  constructor(canvas: Canvas) {
    this.canvas = canvas;

    /* Managed <style> element injected into <head> for live CSS previewing */
    this.styleElement = document.createElement('style');
    document.head.appendChild(this.styleElement);

    this.styleCollector = new StyleCollector(this.styleElement);
    this.svgStamper = new SvgStamper();
    this.sanitizer = new EditorChromeSanitizer();
    this.shellBuilder = new HtmlShellBuilder();
  }

  /* ─── GenerateHTML ──────────────────────────────────────────────────────────
     Runs the full export pipeline and returns a complete HTML document string
     ready to be saved as a file or opened in a new browser tab.
     ─────────────────────────────────────────────────────────────────────────── */
  generateHTML(): string {
    const canvasElement = document.getElementById('canvas');
    if (!canvasElement) {
      console.warn(
        '[HtmlGenerator] Canvas element not found — returning shell.'
      );
      return this.shellBuilder.build('', '', '');
    }

    /* Phase 1 — collect existing head styles before any DOM mutation */
    const embeddedStyles = this.styleCollector.collectHeadStyles();

    /* Phase 2 — stamp SVG dimensions onto the live DOM so the clone gets them */
    const svgRecords = this.svgStamper.stampSVGDimensions(canvasElement);

    /* Phase 3 — deep-clone the canvas (SVG stamps are now baked in) */
    const clone = canvasElement.cloneNode(true) as HTMLElement;

    /* Phase 4 — remove all editor chrome from the clone only */
    this.sanitizer.sanitize(clone);

    /* Phase 5 — restore the live DOM to its pre-stamp state */
    this.svgStamper.restoreSVGStamps(svgRecords);

    /* Phase 6 — generate the computed-style CSS from the live canvas */
    const generatedCSS = this.styleCollector.generateCSS();

    /* Phase 7 — assemble and return the full HTML document */
    return this.shellBuilder.build(
      clone.innerHTML,
      embeddedStyles,
      generatedCSS
    );
  }

  /* ─── GenerateCSS ───────────────────────────────────────────────────────────
     Public passthrough kept for callers that need the CSS string independently
     (e.g. live-preview injection without a full HTML export).
     ─────────────────────────────────────────────────────────────────────────── */
  generateCSS(): string {
    return this.styleCollector.generateCSS();
  }

  /* ─── ApplyCSS ──────────────────────────────────────────────────────────────
     Writes a CSS string directly into the managed <style> element so changes
     are reflected on the live canvas immediately.
     ─────────────────────────────────────────────────────────────────────────── */
  applyCSS(css: string): void {
    this.styleCollector.applyCSS(css);
  }
}
