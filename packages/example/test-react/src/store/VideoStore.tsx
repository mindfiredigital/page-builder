import { create } from 'zustand';

export interface VideoSettings {
  src: string;
  playbackRate: number;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
  posterUrl: string;
  objectFit: 'contain' | 'cover' | 'fill';
  borderRadius: number;
  opacity: number;
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

export const VIDEO_DEFAULTS: VideoSettings = {
  src: '',
  playbackRate: 1,
  autoplay: false,
  muted: false,
  loop: false,
  controls: true,
  posterUrl: '',
  objectFit: 'contain',
  borderRadius: 0,
  opacity: 1,
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

interface VideoState {
  settings: Record<string, VideoSettings>;
  set: (id: string, patch: Partial<VideoSettings>) => void;
  clearComponent: (id: string) => void;
}

export const useVideoStore = create<VideoState>(setState => ({
  settings: {},

  set: (id, patch) =>
    setState(state => ({
      settings: {
        ...state.settings,
        [id]: { ...(state.settings[id] ?? VIDEO_DEFAULTS), ...patch },
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
  useVideoStore.getState().clearComponent(componentId);
});

let _saveTimer: ReturnType<typeof setTimeout> | undefined;
useVideoStore.subscribe((newState, oldState) => {
  if (newState.settings !== oldState.settings) {
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('table-design-change'));
    }, 150);
  }
});
