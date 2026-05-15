/**
 * Unit tests for:
 *   - componentClickManager (handleComponentClick, findSelectedAttribute)
 */

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../../../components/ModalManager', () => ({
  ModalComponent: jest.fn(),
}));

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import { handleComponentClick } from '../../../utils/componentClickManager';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Builds a minimal valid ComponentAttribute */
function makeAttr(
  key: string,
  overrides: Partial<ComponentAttribute> = {}
): ComponentAttribute {
  return {
    id: `id-${key}`,
    key,
    title: key,
    type: 'Input',
    input_type: 'text',
    value: '',
    execute_order: 0,
    default_value: '',
    editable: true,
    ...overrides,
  };
}

/** Creates a mock ModalComponent whose show() resolves with the given result */
function makeModal(resolveWith: ModalResult | null = null) {
  return { show: jest.fn().mockResolvedValue(resolveWith) } as any;
}

/** Creates a mock ModalComponent whose show() rejects */
function makeRejectingModal(err = new Error('modal error')) {
  return { show: jest.fn().mockRejectedValue(err) } as any;
}

const CONFIG: ComponentAttribute[] = [makeAttr('title'), makeAttr('subtitle')];

beforeEach(() => jest.clearAllMocks());

// ===========================================================================
// Guard conditions — early exits
// ===========================================================================

describe('handleComponentClick — guard conditions', () => {
  it('returns without calling updateContentMethod when modalComponent is null', async () => {
    const update = jest.fn();
    await handleComponentClick(
      null as any,
      CONFIG,
      document.createElement('div'),
      update
    );
    expect(update).not.toHaveBeenCalled();
  });

  it('returns without calling updateContentMethod when modalComponent is undefined', async () => {
    const update = jest.fn();
    await handleComponentClick(
      undefined as any,
      CONFIG,
      document.createElement('div'),
      update
    );
    expect(update).not.toHaveBeenCalled();
  });

  it('returns without calling modal.show when attributeConfig is an empty array', async () => {
    const modal = makeModal({ title: 'x' });
    const update = jest.fn();
    await handleComponentClick(
      modal,
      [],
      document.createElement('div'),
      update
    );
    expect(modal.show).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it('returns without calling modal.show when attributeConfig is null', async () => {
    const modal = makeModal({ title: 'x' });
    const update = jest.fn();
    await handleComponentClick(
      modal,
      null as any,
      document.createElement('div'),
      update
    );
    expect(modal.show).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it('returns without calling modal.show when attributeConfig is undefined', async () => {
    const modal = makeModal({ title: 'x' });
    const update = jest.fn();
    await handleComponentClick(
      modal,
      undefined as any,
      document.createElement('div'),
      update
    );
    expect(modal.show).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// modal.show interaction
// ===========================================================================

describe('handleComponentClick — modal.show interaction', () => {
  it('calls modal.show with the provided attributeConfig', async () => {
    const modal = makeModal({ title: 'Hello' });
    await handleComponentClick(
      modal,
      CONFIG,
      document.createElement('div'),
      jest.fn()
    );
    expect(modal.show).toHaveBeenCalledTimes(1);
    expect(modal.show).toHaveBeenCalledWith(CONFIG);
  });

  it('passes the exact same config reference to modal.show', async () => {
    const modal = makeModal({ title: 'v' });
    const config = [makeAttr('x')];
    await handleComponentClick(
      modal,
      config,
      document.createElement('div'),
      jest.fn()
    );
    expect(modal.show).toHaveBeenCalledWith(config);
  });
});

// ===========================================================================
// updateContentMethod invocation
// ===========================================================================

describe('handleComponentClick — updateContentMethod', () => {
  it('calls updateContentMethod with the component element and matched attribute', async () => {
    const modal = makeModal({ title: 'Hello' });
    const update = jest.fn();
    const el = document.createElement('div');
    await handleComponentClick(modal, CONFIG, el, update);
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(el, CONFIG[0]);
  });

  it('passes the exact component HTMLElement reference to updateContentMethod', async () => {
    const modal = makeModal({ title: 'v' });
    const update = jest.fn();
    const el = document.createElement('section');
    await handleComponentClick(modal, [makeAttr('title')], el, update);
    expect(update.mock.calls[0][0]).toBe(el);
  });

  it('does NOT call updateContentMethod when modal resolves with null', async () => {
    const update = jest.fn();
    await handleComponentClick(
      makeModal(null),
      CONFIG,
      document.createElement('div'),
      update
    );
    expect(update).not.toHaveBeenCalled();
  });

  it('does NOT call updateContentMethod when modal resolves with undefined', async () => {
    const update = jest.fn();
    await handleComponentClick(
      makeModal(undefined as any),
      CONFIG,
      document.createElement('div'),
      update
    );
    expect(update).not.toHaveBeenCalled();
  });

  it('does NOT call updateContentMethod when the result key is an empty string', async () => {
    const update = jest.fn();
    // Both keys present but values are empty strings
    await handleComponentClick(
      makeModal({ title: '', subtitle: '' }),
      CONFIG,
      document.createElement('div'),
      update
    );
    expect(update).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// findSelectedAttribute — attribute selection logic
// ===========================================================================

describe('handleComponentClick — attribute selection', () => {
  it('selects the first attribute whose key has a non-empty value', async () => {
    const update = jest.fn();
    // 'title' is empty, 'subtitle' has a value → subtitle should be selected
    await handleComponentClick(
      makeModal({ title: '', subtitle: 'World' }),
      CONFIG,
      document.createElement('div'),
      update
    );
    expect(update).toHaveBeenCalledWith(expect.any(HTMLElement), CONFIG[1]);
  });

  it('selects the first of multiple matching attributes', async () => {
    const multi = [makeAttr('a'), makeAttr('b'), makeAttr('c')];
    const update = jest.fn();
    await handleComponentClick(
      makeModal({ a: 'first', b: 'second', c: 'third' }),
      multi,
      document.createElement('div'),
      update
    );
    expect(update).toHaveBeenCalledWith(expect.any(HTMLElement), multi[0]);
  });

  it('selects an attribute whose value is the number 0 (truthy check: 0 !== undefined)', async () => {
    const config = [makeAttr('count')];
    const update = jest.fn();
    // value is 0 — not undefined, not empty string → should match
    await handleComponentClick(
      makeModal({ count: 0 } as any),
      config,
      document.createElement('div'),
      update
    );
    // 0 is falsy-ish but not '' and not undefined; behaviour depends on impl.
    // The implementation checks `value !== undefined && value !== ''`, so 0 qualifies.
    expect(update).toHaveBeenCalledWith(expect.any(HTMLElement), config[0]);
  });

  it('returns null (no call to update) when no key in result matches the config', async () => {
    const update = jest.fn();
    await handleComponentClick(
      makeModal({ unknownKey: 'value' } as any),
      CONFIG,
      document.createElement('div'),
      update
    );
    expect(update).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// Error handling
// ===========================================================================

describe('handleComponentClick — error handling', () => {
  it('resolves without throwing when modal.show rejects', async () => {
    await expect(
      handleComponentClick(
        makeRejectingModal(),
        CONFIG,
        document.createElement('div'),
        jest.fn()
      )
    ).resolves.toBeUndefined();
  });

  it('does not call updateContentMethod when modal.show rejects', async () => {
    const update = jest.fn();
    await handleComponentClick(
      makeRejectingModal(),
      CONFIG,
      document.createElement('div'),
      update
    );
    expect(update).not.toHaveBeenCalled();
  });

  it('handles rejection with a non-Error value gracefully', async () => {
    const modal = { show: jest.fn().mockRejectedValue('string error') } as any;
    await expect(
      handleComponentClick(
        modal,
        CONFIG,
        document.createElement('div'),
        jest.fn()
      )
    ).resolves.toBeUndefined();
  });
});

// ===========================================================================
// Return value
// ===========================================================================

describe('handleComponentClick — return value', () => {
  it('always returns undefined (Promise<void>)', async () => {
    const result = await handleComponentClick(
      makeModal({ title: 'x' }),
      CONFIG,
      document.createElement('div'),
      jest.fn()
    );
    expect(result).toBeUndefined();
  });

  it('returns undefined even when all guards exit early', async () => {
    const result = await handleComponentClick(
      null as any,
      [],
      document.createElement('div'),
      jest.fn()
    );
    expect(result).toBeUndefined();
  });
});
