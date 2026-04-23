import { TextEncoder, TextDecoder } from 'util';

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((i: number) => Object.keys(store)[i] ?? null),
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
(global as any).html2pdf = jest.fn().mockReturnValue({
  from: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  save: jest.fn().mockResolvedValue(true),
});

// CustomEvent polyfill for older JSDOM
if (typeof (global as any).CustomEvent !== 'function') {
  (global as any).CustomEvent = class CustomEvent extends Event {
    detail: any;
    constructor(
      event: string,
      params: any = { bubbles: false, cancelable: false, detail: null }
    ) {
      super(event, params);
      this.detail = params.detail;
    }
  };
}

if (typeof (global as any).DragEvent !== 'function') {
  class DragEvent extends MouseEvent {
    dataTransfer: any;
    constructor(type: string, config: any = {}) {
      super(type, config);
      this.dataTransfer = config.dataTransfer || {
        data: {},
        setData: function (key: string, val: string) {
          this.data[key] = val;
        },
        getData: function (key: string) {
          return this.data[key];
        },
        dropEffect: 'none',
        effectAllowed: 'all',
        files: [],
      };
    }
  }
  (global as any).DragEvent = DragEvent;
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
