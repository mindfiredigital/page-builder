/**
 * Unit tests for:
 *   - componentClickManager (handleComponentClick, findSelectedAttribute)
 */
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
jest.mock('../../../components/ModalManager', () => ({
  ModalComponent: jest.fn(),
}));
// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------
import { handleComponentClick } from '../../../utils/componentClickManager.js';
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** Builds a minimal valid ComponentAttribute */
function makeAttr(key, overrides = {}) {
  return Object.assign(
    {
      id: `id-${key}`,
      key,
      title: key,
      type: 'Input',
      input_type: 'text',
      value: '',
      execute_order: 0,
      default_value: '',
      editable: true,
    },
    overrides
  );
}
/** Creates a mock ModalComponent whose show() resolves with the given result */
function makeModal(resolveWith = null) {
  return { show: jest.fn().mockResolvedValue(resolveWith) };
}
/** Creates a mock ModalComponent whose show() rejects */
function makeRejectingModal(err = new Error('modal error')) {
  return { show: jest.fn().mockRejectedValue(err) };
}
const CONFIG = [makeAttr('title'), makeAttr('subtitle')];
beforeEach(() => jest.clearAllMocks());
// ===========================================================================
// Guard conditions — early exits
// ===========================================================================
describe('handleComponentClick — guard conditions', () => {
  it('returns without calling updateContentMethod when modalComponent is null', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const update = jest.fn();
      yield handleComponentClick(
        null,
        CONFIG,
        document.createElement('div'),
        update
      );
      expect(update).not.toHaveBeenCalled();
    }));
  it('returns without calling updateContentMethod when modalComponent is undefined', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const update = jest.fn();
      yield handleComponentClick(
        undefined,
        CONFIG,
        document.createElement('div'),
        update
      );
      expect(update).not.toHaveBeenCalled();
    }));
  it('returns without calling modal.show when attributeConfig is an empty array', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const modal = makeModal({ title: 'x' });
      const update = jest.fn();
      yield handleComponentClick(
        modal,
        [],
        document.createElement('div'),
        update
      );
      expect(modal.show).not.toHaveBeenCalled();
      expect(update).not.toHaveBeenCalled();
    }));
  it('returns without calling modal.show when attributeConfig is null', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const modal = makeModal({ title: 'x' });
      const update = jest.fn();
      yield handleComponentClick(
        modal,
        null,
        document.createElement('div'),
        update
      );
      expect(modal.show).not.toHaveBeenCalled();
      expect(update).not.toHaveBeenCalled();
    }));
  it('returns without calling modal.show when attributeConfig is undefined', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const modal = makeModal({ title: 'x' });
      const update = jest.fn();
      yield handleComponentClick(
        modal,
        undefined,
        document.createElement('div'),
        update
      );
      expect(modal.show).not.toHaveBeenCalled();
      expect(update).not.toHaveBeenCalled();
    }));
});
// ===========================================================================
// modal.show interaction
// ===========================================================================
describe('handleComponentClick — modal.show interaction', () => {
  it('calls modal.show with the provided attributeConfig', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const modal = makeModal({ title: 'Hello' });
      yield handleComponentClick(
        modal,
        CONFIG,
        document.createElement('div'),
        jest.fn()
      );
      expect(modal.show).toHaveBeenCalledTimes(1);
      expect(modal.show).toHaveBeenCalledWith(CONFIG);
    }));
  it('passes the exact same config reference to modal.show', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const modal = makeModal({ title: 'v' });
      const config = [makeAttr('x')];
      yield handleComponentClick(
        modal,
        config,
        document.createElement('div'),
        jest.fn()
      );
      expect(modal.show).toHaveBeenCalledWith(config);
    }));
});
// ===========================================================================
// updateContentMethod invocation
// ===========================================================================
describe('handleComponentClick — updateContentMethod', () => {
  it('calls updateContentMethod with the component element and matched attribute', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const modal = makeModal({ title: 'Hello' });
      const update = jest.fn();
      const el = document.createElement('div');
      yield handleComponentClick(modal, CONFIG, el, update);
      expect(update).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledWith(el, CONFIG[0]);
    }));
  it('passes the exact component HTMLElement reference to updateContentMethod', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const modal = makeModal({ title: 'v' });
      const update = jest.fn();
      const el = document.createElement('section');
      yield handleComponentClick(modal, [makeAttr('title')], el, update);
      expect(update.mock.calls[0][0]).toBe(el);
    }));
  it('does NOT call updateContentMethod when modal resolves with null', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const update = jest.fn();
      yield handleComponentClick(
        makeModal(null),
        CONFIG,
        document.createElement('div'),
        update
      );
      expect(update).not.toHaveBeenCalled();
    }));
  it('does NOT call updateContentMethod when modal resolves with undefined', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const update = jest.fn();
      yield handleComponentClick(
        makeModal(undefined),
        CONFIG,
        document.createElement('div'),
        update
      );
      expect(update).not.toHaveBeenCalled();
    }));
  it('does NOT call updateContentMethod when the result key is an empty string', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const update = jest.fn();
      // Both keys present but values are empty strings
      yield handleComponentClick(
        makeModal({ title: '', subtitle: '' }),
        CONFIG,
        document.createElement('div'),
        update
      );
      expect(update).not.toHaveBeenCalled();
    }));
});
// ===========================================================================
// findSelectedAttribute — attribute selection logic
// ===========================================================================
describe('handleComponentClick — attribute selection', () => {
  it('selects the first attribute whose key has a non-empty value', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const update = jest.fn();
      // 'title' is empty, 'subtitle' has a value → subtitle should be selected
      yield handleComponentClick(
        makeModal({ title: '', subtitle: 'World' }),
        CONFIG,
        document.createElement('div'),
        update
      );
      expect(update).toHaveBeenCalledWith(expect.any(HTMLElement), CONFIG[1]);
    }));
  it('selects the first of multiple matching attributes', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const multi = [makeAttr('a'), makeAttr('b'), makeAttr('c')];
      const update = jest.fn();
      yield handleComponentClick(
        makeModal({ a: 'first', b: 'second', c: 'third' }),
        multi,
        document.createElement('div'),
        update
      );
      expect(update).toHaveBeenCalledWith(expect.any(HTMLElement), multi[0]);
    }));
  it('selects an attribute whose value is the number 0 (truthy check: 0 !== undefined)', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const config = [makeAttr('count')];
      const update = jest.fn();
      // value is 0 — not undefined, not empty string → should match
      yield handleComponentClick(
        makeModal({ count: 0 }),
        config,
        document.createElement('div'),
        update
      );
      // 0 is falsy-ish but not '' and not undefined; behaviour depends on impl.
      // The implementation checks `value !== undefined && value !== ''`, so 0 qualifies.
      expect(update).toHaveBeenCalledWith(expect.any(HTMLElement), config[0]);
    }));
  it('returns null (no call to update) when no key in result matches the config', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const update = jest.fn();
      yield handleComponentClick(
        makeModal({ unknownKey: 'value' }),
        CONFIG,
        document.createElement('div'),
        update
      );
      expect(update).not.toHaveBeenCalled();
    }));
});
// ===========================================================================
// Error handling
// ===========================================================================
describe('handleComponentClick — error handling', () => {
  it('resolves without throwing when modal.show rejects', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield expect(
        handleComponentClick(
          makeRejectingModal(),
          CONFIG,
          document.createElement('div'),
          jest.fn()
        )
      ).resolves.toBeUndefined();
    }));
  it('does not call updateContentMethod when modal.show rejects', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const update = jest.fn();
      yield handleComponentClick(
        makeRejectingModal(),
        CONFIG,
        document.createElement('div'),
        update
      );
      expect(update).not.toHaveBeenCalled();
    }));
  it('handles rejection with a non-Error value gracefully', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const modal = { show: jest.fn().mockRejectedValue('string error') };
      yield expect(
        handleComponentClick(
          modal,
          CONFIG,
          document.createElement('div'),
          jest.fn()
        )
      ).resolves.toBeUndefined();
    }));
});
// ===========================================================================
// Return value
// ===========================================================================
describe('handleComponentClick — return value', () => {
  it('always returns undefined (Promise<void>)', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const result = yield handleComponentClick(
        makeModal({ title: 'x' }),
        CONFIG,
        document.createElement('div'),
        jest.fn()
      );
      expect(result).toBeUndefined();
    }));
  it('returns undefined even when all guards exit early', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const result = yield handleComponentClick(
        null,
        [],
        document.createElement('div'),
        jest.fn()
      );
      expect(result).toBeUndefined();
    }));
});
