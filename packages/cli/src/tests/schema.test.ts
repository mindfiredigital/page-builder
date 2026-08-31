import {
  escapeHtml,
  wrapTextSpan,
  hasTextSpan,
  isBlockType,
  estimateWrappedHeight,
  makeCanvasRoot,
  getCanvasRoot,
  getBlocks,
  checkScope,
  pageSchema,
  BLOCK_TYPES,
  BLOCKS,
  imageContentTemplate,
  CANVAS,
  type Block,
} from '../schema.js';

describe('escapeHtml', () => {
  it('escapes all five HTML-significant characters', () => {
    expect(escapeHtml(`<script>alert("x")&'y'</script>`)).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&amp;&#39;y&#39;&lt;/script&gt;'
    );
  });

  it('leaves plain text untouched', () => {
    expect(escapeHtml('Hello world 123')).toBe('Hello world 123');
  });

  it('neutralizes a script-injection attempt in block content', () => {
    const malicious = '<img src=x onerror=alert(1)>';
    const escaped = escapeHtml(malicious);
    expect(escaped).not.toContain('<img');
    expect(escaped).toBe('&lt;img src=x onerror=alert(1)&gt;');
  });
});

describe('wrapTextSpan', () => {
  it('wraps escaped text in the exact contenteditable span core expects', () => {
    expect(wrapTextSpan('Hi')).toBe(
      '<span class="component-text-content" contenteditable="true">Hi</span>'
    );
  });

  it('escapes text before wrapping', () => {
    expect(wrapTextSpan('<b>x</b>')).toBe(
      '<span class="component-text-content" contenteditable="true">&lt;b&gt;x&lt;/b&gt;</span>'
    );
  });
});

describe('hasTextSpan', () => {
  it('detects the component-text-content class regardless of other classes', () => {
    expect(
      hasTextSpan('<span class="foo component-text-content bar">x</span>')
    ).toBe(true);
  });

  it('returns false when the span is absent', () => {
    expect(hasTextSpan('<div>plain</div>')).toBe(false);
  });
});

describe('isBlockType', () => {
  it('accepts every type in the v1 palette', () => {
    for (const type of BLOCK_TYPES) {
      expect(isBlockType(type)).toBe(true);
    }
  });

  it('accepts image (in scope as of v1.x)', () => {
    expect(isBlockType('image')).toBe(true);
  });

  it('rejects a type outside v1 scope', () => {
    expect(isBlockType('video')).toBe(false);
    expect(isBlockType('')).toBe(false);
  });
});

describe('BLOCKS.image', () => {
  it('has the defaults matching core\'s ImageComponent.create() 300x300 container', () => {
    expect(BLOCKS.image.defaultWidth).toBe(300);
    expect(BLOCKS.image.defaultHeight).toBe(300);
    expect(BLOCKS.image.baseClass).toBe('image-component');
    expect(BLOCKS.image.requiresTextSpan).toBe(false);
  });
});

describe('imageContentTemplate', () => {
  it('includes every selector target ImageComponent.restoreImageUpload() queries for', () => {
    const html = imageContentTemplate();
    expect(html).toContain('<img');
    expect(html).toContain('class="upload-btn"');
    expect(html).toContain('type="file"');
    expect(html).toMatch(/<div>[^<]*<\/div>/);
  });

  it('never bakes a src into the template — imageSrc is the source of truth', () => {
    expect(imageContentTemplate()).not.toMatch(/<img[^>]*\ssrc=/);
  });
});

describe('estimateWrappedHeight', () => {
  it('returns the minHeight floor for an empty/unmapped-type text', () => {
    expect(estimateWrappedHeight('text', '', 300, 50)).toBe(50);
    expect(estimateWrappedHeight('button', 'ignored', 300, 48)).toBe(48);
  });

  it('never returns less than minHeight for short text', () => {
    expect(estimateWrappedHeight('text', 'hi', 300, 50)).toBeGreaterThanOrEqual(50);
  });

  it('grows past minHeight for long text that would wrap', () => {
    const longText = 'x'.repeat(500);
    const result = estimateWrappedHeight('header', longText, 400, 60);
    expect(result).toBeGreaterThan(60);
  });
});

describe('makeCanvasRoot / getCanvasRoot / getBlocks', () => {
  it('makeCanvasRoot produces a recognizable canvas root entry', () => {
    const root = makeCanvasRoot();
    expect(root.id).toBe('canvas');
    expect(root.type).toBe('canvas');
  });

  it('getCanvasRoot finds it and getBlocks excludes it', () => {
    const root = makeCanvasRoot();
    const block: Block = {
      id: 'b1',
      type: 'text',
      content: 'hi',
      position: { x: 0, y: 0 },
      dimensions: { width: 100, height: 50 },
      style: {},
      inlineStyle: '',
      classes: [],
      dataAttributes: {},
    };
    const page = [root, block];

    expect(getCanvasRoot(page)).toBe(root);
    expect(getBlocks(page)).toEqual([block]);
  });

  it('getCanvasRoot returns undefined when the root is missing', () => {
    expect(getCanvasRoot([])).toBeUndefined();
  });
});

describe('checkScope', () => {
  const makeBlock = (overrides: Partial<Block> = {}): Block => ({
    id: 'b1',
    type: 'text',
    content: 'hi',
    position: { x: 0, y: 0 },
    dimensions: { width: 100, height: 50 },
    style: {},
    inlineStyle: '',
    classes: [],
    dataAttributes: {},
    ...overrides,
  });

  it('passes a valid flat, absolute-mode page', () => {
    expect(checkScope([makeCanvasRoot(), makeBlock()])).toBeNull();
  });

  it('rejects a page missing its canvas root', () => {
    const violation = checkScope([makeBlock()]);
    expect(violation).not.toBeNull();
    expect(violation?.reason).toMatch(/canvas root/i);
  });

  it('rejects grid-mode pages', () => {
    const root = { ...makeCanvasRoot(), classes: ['grid-layout-active'] };
    const violation = checkScope([root]);
    expect(violation).not.toBeNull();
    expect(violation?.reason).toMatch(/grid layout mode/i);
  });

  it('rejects an out-of-scope block type', () => {
    const violation = checkScope([
      makeCanvasRoot(),
      makeBlock({ type: 'video' }),
    ]);
    expect(violation).not.toBeNull();
    expect(violation?.reason).toMatch(/outside pagectl v1's supported palette/);
  });

  it('accepts an image block', () => {
    expect(
      checkScope([makeCanvasRoot(), makeBlock({ type: 'image', imageSrc: null })])
    ).toBeNull();
  });
});

describe('pageSchema', () => {
  it('accepts a minimal valid page', () => {
    const result = pageSchema.safeParse([makeCanvasRoot()]);
    expect(result.success).toBe(true);
  });

  it('rejects an empty array (min(1))', () => {
    const result = pageSchema.safeParse([]);
    expect(result.success).toBe(false);
  });

  it('rejects a block missing required fields', () => {
    const result = pageSchema.safeParse([{ id: 'x' }]);
    expect(result.success).toBe(false);
  });

  it('defaults optional style/classes/dataAttributes fields', () => {
    const result = pageSchema.safeParse([
      {
        id: 'canvas',
        type: 'canvas',
        content: '',
        position: { x: 0, y: 0 },
        dimensions: { width: CANVAS.width, height: CANVAS.height },
      },
    ]);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data[0].style).toEqual({});
      expect(result.data[0].classes).toEqual([]);
      expect(result.data[0].dataAttributes).toEqual({});
    }
  });
});
