import { jest } from '@jest/globals';

/* The real core PageBuilder does full DOM/canvas/sidebar setup — far more
   than this wrapper's own contract needs. Mock it so these tests exercise
   PageBuilderComponent's own logic (property bridging, lifecycle guards,
   error handling) in isolation. */
const mockApplyDesign = jest.fn();
const mockGenerateOutput = jest.fn(() => ({ html: '<div></div>', css: '' }));
const MockPageBuilder = jest.fn().mockImplementation(() => ({
  applyDesign: mockApplyDesign,
  generateOutput: mockGenerateOutput,
}));

jest.unstable_mockModule(
  '@mindfiredigital/page-builder/dist/PageBuilder.js',
  () => ({
    PageBuilder: MockPageBuilder,
  })
);

const { PageBuilderComponent } = await import('../components/PageBuilder.js');

describe('PageBuilderComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('self-registers the page-builder custom element exactly once', () => {
    expect(customElements.get('page-builder')).toBe(PageBuilderComponent);
  });

  describe('property getters/setters', () => {
    it('editable: reflects the value passed in, and is initially null', () => {
      const el = document.createElement('page-builder') as InstanceType<
        typeof PageBuilderComponent
      >;
      expect(el.editable).toBeNull();
      el.editable = true;
      expect(el.editable).toBe(true);
    });

    it('brandTitle, showAttributeTab, layoutMode: round-trip the assigned value', () => {
      const el = document.createElement('page-builder') as InstanceType<
        typeof PageBuilderComponent
      >;
      el.brandTitle = 'My Brand';
      el.showAttributeTab = true;
      el.layoutMode = 'grid';

      expect(el.brandTitle).toBe('My Brand');
      expect(el.showAttributeTab).toBe(true);
      expect(el.layoutMode).toBe('grid');
    });

    it('configData: round-trips and triggers (re-)initialization', () => {
      const el = document.createElement('page-builder') as InstanceType<
        typeof PageBuilderComponent
      >;
      document.body.appendChild(el);

      const config = { Basic: [], Extra: [], Custom: {} };
      el.configData = config;

      expect(el.configData).toBe(config);
      expect(MockPageBuilder).toHaveBeenCalled();
    });
  });

  describe('applyDesign / generateOutput before initialization', () => {
    it('applyDesign throws when the element has not been initialized yet', () => {
      const el = document.createElement('page-builder') as InstanceType<
        typeof PageBuilderComponent
      >;
      expect(() => el.applyDesign([])).toThrow(
        'PageBuilder is not initialized yet.'
      );
    });

    it('generateOutput throws when the element has not been initialized yet', () => {
      const el = document.createElement('page-builder') as InstanceType<
        typeof PageBuilderComponent
      >;
      expect(() => el.generateOutput()).toThrow(
        'PageBuilder is not initialized yet.'
      );
    });
  });

  describe('applyDesign / generateOutput after initialization', () => {
    it('delegates to the underlying core PageBuilder instance once configData has initialized it', () => {
      const el = document.createElement('page-builder') as InstanceType<
        typeof PageBuilderComponent
      >;
      document.body.appendChild(el);
      el.configData = { Basic: [], Extra: [], Custom: {} };

      const design = [{ id: 'canvas', type: 'canvas' }] as any;
      el.applyDesign(design);
      expect(mockApplyDesign).toHaveBeenCalledWith(design);

      const output = el.generateOutput();
      expect(mockGenerateOutput).toHaveBeenCalled();
      expect(output).toEqual({ html: '<div></div>', css: '' });
    });
  });

  describe('connectedCallback', () => {
    it('populates the template markup and initializes on mount', async () => {
      const el = document.createElement('page-builder');
      document.body.appendChild(el);

      // connectedCallback defers to a macrotask
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(el.querySelector('#app')).not.toBeNull();
      expect(el.querySelector('#canvas')).not.toBeNull();
      expect(MockPageBuilder).toHaveBeenCalled();
    });

    it('does not re-run initialization if already initialized', async () => {
      const el = document.createElement('page-builder') as InstanceType<
        typeof PageBuilderComponent
      >;
      document.body.appendChild(el);
      await new Promise(resolve => setTimeout(resolve, 0));

      const callsAfterMount = MockPageBuilder.mock.calls.length;

      // Re-triggering connectedCallback (e.g. re-appending) should be a no-op
      // once already initialized.
      el.connectedCallback();
      expect(MockPageBuilder.mock.calls.length).toBe(callsAfterMount);
    });
  });
});
