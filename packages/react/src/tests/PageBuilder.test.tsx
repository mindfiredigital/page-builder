import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PageBuilderReact } from '../components/PageBuilder';
import type { DynamicComponents } from '../types/types';

/* The dynamic `import('@mindfiredigital/page-builder-web-component')` in
   PageBuilder.tsx is a side-effect-only load (it just needs the
   `page-builder` custom element to become defined). Stub it out so tests
   don't need the real (heavy) web-component package built. */
jest.mock('@mindfiredigital/page-builder-web-component', () => ({}), {
  virtual: true,
});

class FakePageBuilderElement extends HTMLElement {
  configData: unknown;
  initialDesign: unknown;
  editable: unknown;
  brandTitle: unknown;
  showAttributeTab: unknown;
  layoutMode: unknown;
}

beforeAll(() => {
  if (!customElements.get('page-builder')) {
    customElements.define('page-builder', FakePageBuilderElement);
  }
});

const baseConfig: DynamicComponents = { Basic: [], Extra: [] };

describe('PageBuilderReact', () => {
  it('renders a <page-builder> custom element', () => {
    const { container } = render(<PageBuilderReact config={baseConfig} />);
    expect(container.querySelector('page-builder')).not.toBeNull();
  });

  it('propagates config/editable/brandTitle/showAttributeTab/layoutMode onto the underlying element', async () => {
    render(
      <PageBuilderReact
        config={baseConfig}
        editable={false}
        brandTitle="Acme"
        showAttributeTab
        layoutMode="grid"
      />
    );
    const el = document.querySelector('page-builder') as FakePageBuilderElement;

    await waitFor(() => {
      expect(el.editable).toBe(false);
      expect(el.brandTitle).toBe('Acme');
      expect(el.showAttributeTab).toBe(true);
      expect(el.layoutMode).toBe('grid');
    });

    expect(el.getAttribute('config-data')).toBe(JSON.stringify(el.configData));
  });

  it('re-propagates layoutMode when it changes on an already-mounted instance', async () => {
    const { rerender } = render(
      <PageBuilderReact config={baseConfig} layoutMode="absolute" />
    );
    const el = document.querySelector('page-builder') as FakePageBuilderElement;

    await waitFor(() => expect(el.layoutMode).toBe('absolute'));

    rerender(<PageBuilderReact config={baseConfig} layoutMode="grid" />);

    await waitFor(() => expect(el.layoutMode).toBe('grid'));
  });

  it('calls onChange with the event detail when the underlying element dispatches design-change', () => {
    const onChange = jest.fn();
    render(<PageBuilderReact config={baseConfig} onChange={onChange} />);
    const el = document.querySelector('page-builder') as HTMLElement;

    const design = [{ id: 'canvas' }];
    el.dispatchEvent(new CustomEvent('design-change', { detail: design }));

    expect(onChange).toHaveBeenCalledWith(design);
  });

  it('registers a react-component-<key> custom element for each custom component', async () => {
    const CustomComp = () => <div>custom</div>;
    render(
      <PageBuilderReact
        config={baseConfig}
        customComponents={{
          MyWidget: { component: CustomComp, title: 'My Widget' },
        }}
      />
    );

    await waitFor(() => {
      expect(customElements.get('react-component-mywidget')).toBeDefined();
    });
  });

  it('skips a custom component entry with no `component` and does not throw', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() =>
      render(
        <PageBuilderReact
          config={baseConfig}
          customComponents={{
            // @ts-expect-error — deliberately invalid to exercise the guard
            Broken: { title: 'no component field' },
          }}
        />
      )
    ).not.toThrow();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Skipping invalid component')
    );
    warnSpy.mockRestore();
  });
});
