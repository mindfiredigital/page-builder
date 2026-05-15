/**
 * JSONStorage.test.ts
 * Unit tests for the localStorage persistence service.
 */
import { JSONStorage } from '../../../services/JSONStorage.js';
const STORAGE_KEY = 'pageLayout';
describe('JSONStorage', () => {
  let storage;
  beforeEach(() => {
    storage = new JSONStorage();
    localStorage.clear();
    jest.clearAllMocks();
  });
  // ─── save() ───────────────────────────────────────────────────────────────
  describe('save()', () => {
    it('should call localStorage.setItem with the correct key', () => {
      storage.save([]);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.any(String)
      );
    });
    it('should serialise the design to JSON', () => {
      const design = [{ id: 'canvas', type: 'canvas', content: '' }];
      storage.save(design);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(design)
      );
    });
    it('should save an empty array without throwing', () => {
      expect(() => storage.save([])).not.toThrow();
    });
    it('should overwrite a previously saved value', () => {
      const design1 = [{ id: 'c1', type: 'canvas', content: '' }];
      const design2 = [{ id: 'c2', type: 'canvas', content: 'new' }];
      storage.save(design1);
      storage.save(design2);
      const calls = localStorage.setItem.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(JSON.parse(lastCall[1])[0].id).toBe('c2');
    });
  });
  // ─── load() ───────────────────────────────────────────────────────────────
  describe('load()', () => {
    it('should return null when nothing is stored', () => {
      localStorage.getItem.mockReturnValueOnce(null);
      expect(storage.load()).toBeNull();
    });
    it('should deserialise and return stored design', () => {
      const design = [{ id: 'canvas', type: 'canvas', content: '' }];
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(design));
      expect(storage.load()).toEqual(design);
    });
    it('should return null when stored value is invalid JSON', () => {
      localStorage.getItem.mockReturnValueOnce('{ not valid json }');
      expect(storage.load()).toBeNull();
    });
    it('should return null when stored value is an empty string', () => {
      localStorage.getItem.mockReturnValueOnce('');
      expect(storage.load()).toBeNull();
    });
    it('should call localStorage.getItem with the correct key', () => {
      localStorage.getItem.mockReturnValueOnce(null);
      storage.load();
      expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });
    it('should return a typed PageBuilderDesign array', () => {
      const design = [
        { id: 'canvas', type: 'canvas', content: '', position: { x: 0, y: 0 } },
      ];
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(design));
      const result = storage.load();
      expect(Array.isArray(result)).toBe(true);
    });
  });
  // ─── remove() ─────────────────────────────────────────────────────────────
  describe('remove()', () => {
    it('should call localStorage.removeItem with the correct key', () => {
      storage.remove();
      expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });
    it('should not throw when called on an empty store', () => {
      expect(() => storage.remove()).not.toThrow();
    });
    it('should make load() return null after removal', () => {
      localStorage.getItem.mockReturnValueOnce(null);
      storage.remove();
      expect(storage.load()).toBeNull();
    });
  });
  // ─── round-trip ───────────────────────────────────────────────────────────
  describe('save → load round-trip', () => {
    it('should restore exactly what was saved (using real localStorage mock)', () => {
      // Use the real in-memory mock from jest.setup.ts
      const realStorage = new JSONStorage();
      const design = [
        {
          id: 'canvas',
          type: 'canvas',
          content: '',
          position: { x: 0, y: 0 },
          dimensions: { width: 100, height: 200 },
          style: {},
          inlineStyle: '',
          classes: [],
          dataAttributes: {},
          props: {},
        },
        {
          id: 'button1',
          type: 'button',
          content: '<button>Hi</button>',
          position: { x: 10, y: 20 },
          dimensions: { width: 80, height: 30 },
          style: {},
          inlineStyle: '',
          classes: ['button-component'],
          dataAttributes: {},
          props: {},
        },
      ];
      // Manually wire the mock to store/retrieve
      let stored = null;
      localStorage.setItem.mockImplementation((_k, v) => {
        stored = v;
      });
      localStorage.getItem.mockImplementation(() => stored);
      realStorage.save(design);
      const loaded = realStorage.load();
      expect(loaded).toEqual(design);
    });
  });
});
