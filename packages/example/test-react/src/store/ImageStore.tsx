import { create } from 'zustand';

export interface ImageSettings {
  src: string;
  objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  altText: string;
  caption: string;
  borderRadius: number;
  opacity: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  blur: number;
  sepia: number;
  saturate: number;
  boxShadow: string;
  widthValue: number;
  widthUnit: 'px' | '%';
  heightValue: number;
  heightUnit: 'px' | '%';
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
}

export const IMAGE_DEFAULTS: ImageSettings = {
  src: '',
  objectFit: 'contain',
  altText: '',
  caption: '',
  borderRadius: 0,
  opacity: 1,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  blur: 0,
  sepia: 0,
  saturate: 100,
  boxShadow: 'none',
  widthValue: 100,
  widthUnit: '%',
  heightValue: 100,
  heightUnit: '%',
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
};

interface ImageState {
  settings: Record<string, ImageSettings>;
  set: (id: string, patch: Partial<ImageSettings>) => void;
  clearComponent: (id: string) => void;
}

export const useImageStore = create<ImageState>(setState => ({
  settings: {},

  set: (id, patch) =>
    setState(state => ({
      settings: {
        ...state.settings,
        [id]: { ...(state.settings[id] ?? IMAGE_DEFAULTS), ...patch },
      },
    })),

  clearComponent: id =>
    setState(state => {
      const settings = { ...state.settings };
      delete settings[id];
      return { settings };
    }),
}));

document.addEventListener('pb:component-removed', (e: Event) => {
  const { componentId } = (e as CustomEvent<{ componentId: string }>).detail;
  useImageStore.getState().clearComponent(componentId);
});

let _saveTimer: ReturnType<typeof setTimeout> | undefined;
useImageStore.subscribe((newState, oldState) => {
  if (newState.settings !== oldState.settings) {
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('table-design-change'));
    }, 150);
  }
});
