import { create } from 'zustand';

interface ImageState {
  altTexts: Record<string, string>;
  objectFits: Record<string, string>;
  captions: Record<string, string>;
  setAltText: (id: string, text: string) => void;
  setObjectFit: (id: string, fit: string) => void;
  setCaption: (id: string, caption: string) => void;
  clearComponent: (id: string) => void;
  getAltText: (id: string) => string;
  getObjectFit: (id: string) => string;
  getCaption: (id: string) => string;
}

export const useImageStore = create<ImageState>((set, get) => ({
  altTexts: {},
  objectFits: {},
  captions: {},

  setAltText: (id, text) =>
    set(state => ({ altTexts: { ...state.altTexts, [id]: text } })),

  setObjectFit: (id, fit) =>
    set(state => ({ objectFits: { ...state.objectFits, [id]: fit } })),

  setCaption: (id, caption) =>
    set(state => ({ captions: { ...state.captions, [id]: caption } })),

  /* Wipe all data for a specific component instance when it is removed */
  clearComponent: id => {
    set(state => {
      const altTexts = { ...state.altTexts };
      const objectFits = { ...state.objectFits };
      const captions = { ...state.captions };
      delete altTexts[id];
      delete objectFits[id];
      delete captions[id];
      return { altTexts, objectFits, captions };
    });
  },

  getAltText: id => get().altTexts[id] ?? '',
  getObjectFit: id => get().objectFits[id] ?? 'contain',
  getCaption: id => get().captions[id] ?? '',
}));

/* Clear store data whenever the page-builder removes a component from the canvas */
document.addEventListener('pb:component-removed', (e: Event) => {
  const { componentId } = (e as CustomEvent<{ componentId: string }>).detail;
  useImageStore.getState().clearComponent(componentId);
});
