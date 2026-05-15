import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// localStorage mock
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => {
      var _a;
      return (_a = store[key]) !== null && _a !== void 0 ? _a : null;
    }),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn(i => {
      var _a;
      return (_a = Object.keys(store)[i]) !== null && _a !== void 0 ? _a : null;
    }),
  };
})();
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});
// window.matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
// ResizeObserver mock
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
// URL.createObjectURL / revokeObjectURL mocks
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();
// html2pdf stub
global.html2pdf = jest.fn().mockReturnValue({
  from: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  save: jest.fn().mockResolvedValue(true),
});
// CustomEvent polyfill for older JSDOM
if (typeof global.CustomEvent !== 'function') {
  global.CustomEvent = class CustomEvent extends Event {
    constructor(
      event,
      params = { bubbles: false, cancelable: false, detail: null }
    ) {
      super(event, params);
      this.detail = params.detail;
    }
  };
}
if (typeof global.DragEvent !== 'function') {
  class DragEvent extends MouseEvent {
    constructor(type, config = {}) {
      super(type, config);
      this.dataTransfer = config.dataTransfer || {
        data: {},
        setData: function (key, val) {
          this.data[key] = val;
        },
        getData: function (key) {
          return this.data[key];
        },
        dropEffect: 'none',
        effectAllowed: 'all',
        files: [],
      };
    }
  }
  global.DragEvent = DragEvent;
}
// Mock the CustomizationSidebar to prevent DOM errors
jest.mock('../sidebar/CustomizationSidebar', () => {
  return {
    CustomizationSidebar: jest.fn().mockImplementation(() => ({
      render: jest.fn(),
      update: jest.fn(),
      sidebarElement: { style: {} }, // Provide a fake style object
    })),
  };
});
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
