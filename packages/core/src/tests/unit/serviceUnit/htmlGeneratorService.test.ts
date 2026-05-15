import {
  EditorChromeSanitizer,
  HtmlShellBuilder,
  StyleCollector,
  SvgStamper,
} from '../../../services/HtmlGeneratorService';
import { Canvas } from '../../../canvas/Canvas';

import { HTMLGenerator } from '../../../services/HTMLGenerator';

describe('HTML Export Pipeline - Integrated Unit Tests', () => {
  // 1. EditorChromeSanitizer Tests
  describe('EditorChromeSanitizer', () => {
    let sanitizer: EditorChromeSanitizer;
    let root: HTMLElement;

    beforeEach(() => {
      sanitizer = new EditorChromeSanitizer();
      root = document.createElement('div');
      root.innerHTML = `
        <div id="comp" class="editable-component component-resizer" contenteditable="true">
          <span class="component-label">Header</span>
          <div class="component-controls"></div>
          <svg><title>Editor Only</title><circle cx="5" cy="5" r="2"></circle></svg>
        </div>
      `;
    });

    it('should strip all editor-specific nodes and attributes', () => {
      sanitizer.sanitize(root);
      expect(root.querySelector('.component-label')).toBeNull();
      expect(root.querySelector('.component-controls')).toBeNull();
      expect(root.querySelector('title')).toBeNull();
      expect(root.querySelector('circle')).not.toBeNull();
      expect(root.querySelector('#comp')?.hasAttribute('contenteditable')).toBe(
        false
      );
    });
  });

  // 2. SvgStamper Tests
  describe('SvgStamper', () => {
    let stamper: SvgStamper;
    let canvas: HTMLElement;

    beforeEach(() => {
      stamper = new SvgStamper();
      canvas = document.createElement('div');
      canvas.innerHTML = `<svg id="test-svg" style="color: blue;"></svg>`;
      document.body.appendChild(canvas);

      const svg = canvas.querySelector('svg')!;
      svg.getBoundingClientRect = jest
        .fn()
        .mockReturnValue({ width: 200, height: 100 });
    });

    afterEach(() => document.body.removeChild(canvas));

    it('should stamp and then restore SVG attributes', () => {
      const records = stamper.stampSVGDimensions(canvas);
      const svg = canvas.querySelector('svg')!;

      expect(svg.getAttribute('width')).toBe('200');
      expect(svg.getAttribute('viewBox')).toBe('0 0 200 100');

      stamper.restoreSVGStamps(records);
      expect(svg.getAttribute('width')).toBeNull();
      expect(svg.getAttribute('style')).toBe('color: blue;');
    });
  });

  // 3. StyleCollector Tests
  describe('StyleCollector', () => {
    let collector: StyleCollector;
    let styleEl: HTMLStyleElement;

    beforeEach(() => {
      styleEl = document.createElement('style');
      document.head.appendChild(styleEl);
      collector = new StyleCollector(styleEl);
      document.body.innerHTML =
        '<div id="canvas"><p style="display: inline;">Text</p></div>';
    });

    it('should collect head styles and ignore the managed preview style tag', () => {
      const headStyle = document.createElement('style');
      headStyle.textContent = 'body { margin: 0; }';
      document.head.appendChild(headStyle);

      const collected = collector.collectHeadStyles();
      expect(collected).toContain('body { margin: 0; }');
      document.head.removeChild(headStyle);
    });

    it('should generate CSS and force vertical-align for inline elements', () => {
      const css = collector.generateCSS();
      expect(css).toContain('vertical-align: bottom;');
    });
  });

  // 4. HtmlShellBuilder Tests
  describe('HtmlShellBuilder', () => {
    let builder: HtmlShellBuilder;

    beforeEach(() => {
      builder = new HtmlShellBuilder();
    });

    it('should wrap content in a valid HTML5 shell', () => {
      const result = builder.build(
        '<div>Content</div>',
        '/* head */',
        '/* generated */'
      );
      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<div id="canvas"');
      expect(result).toContain('/* head */');
      expect(result).toContain('Content');
    });

    it('should switch layout classes based on Grid vs Absolute mode', () => {
      jest.spyOn(Canvas, 'layoutMode', 'get').mockReturnValue('grid');
      expect(builder.build('', '', '')).toContain('grid-layout-active');

      jest.spyOn(Canvas, 'layoutMode', 'get').mockReturnValue('absolute');
      expect(builder.build('', '', '')).toContain('preview-printable');
    });
  });

  // 5. HTMLGenerator (Orchestrator) Tests
  describe('HTMLGenerator Orchestration', () => {
    let generator: HTMLGenerator;
    let canvasInstance: Canvas;

    beforeEach(() => {
      document.body.innerHTML = '<div id="canvas"><span>Export Me</span></div>';
      canvasInstance = new Canvas();
      generator = new HTMLGenerator(canvasInstance);
    });

    it('should run the entire pipeline and return a string', () => {
      const output = generator.generateHTML();
      expect(typeof output).toBe('string');
      expect(output).toContain('Export Me');
      expect(output).toContain('<!DOCTYPE html>');
    });

    it('should handle missing canvas gracefully', () => {
      document.body.innerHTML = ''; // Remove canvas
      const output = generator.generateHTML();
      expect(output).toContain('<!DOCTYPE html>');
      expect(output).not.toContain('Export Me');
    });

    it('should apply CSS updates to the document head', () => {
      const mockCSS = '.test { color: red; }';
      generator.applyCSS(mockCSS);
      const styleTags = document.head.querySelectorAll('style');
      const lastStyleTag = styleTags[styleTags.length - 1];

      expect(lastStyleTag.textContent).toBe(mockCSS);
    });
  });
});
