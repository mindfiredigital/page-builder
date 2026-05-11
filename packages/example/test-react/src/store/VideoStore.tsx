import { create } from 'zustand';

interface VideoState {
  playbackRates: Record<string, number>;
  autoplay: Record<string, boolean>;
  muted: Record<string, boolean>;
  loop: Record<string, boolean>;
  setPlaybackRate: (id: string, rate: number) => void;
  setAutoplay: (id: string, value: boolean) => void;
  setMuted: (id: string, value: boolean) => void;
  setLoop: (id: string, value: boolean) => void;
  clearComponent: (id: string) => void;
  getPlaybackRate: (id: string) => number;
  getAutoplay: (id: string) => boolean;
  getMuted: (id: string) => boolean;
  getLoop: (id: string) => boolean;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  playbackRates: {},
  autoplay: {},
  muted: {},
  loop: {},

  setPlaybackRate: (id, rate) =>
    set(state => ({ playbackRates: { ...state.playbackRates, [id]: rate } })),

  setAutoplay: (id, value) =>
    set(state => ({ autoplay: { ...state.autoplay, [id]: value } })),

  setMuted: (id, value) =>
    set(state => ({ muted: { ...state.muted, [id]: value } })),

  setLoop: (id, value) =>
    set(state => ({ loop: { ...state.loop, [id]: value } })),

  /* Wipe all data for a specific component instance when it is removed */
  clearComponent: id => {
    set(state => {
      const playbackRates = { ...state.playbackRates };
      const autoplay = { ...state.autoplay };
      const muted = { ...state.muted };
      const loop = { ...state.loop };
      delete playbackRates[id];
      delete autoplay[id];
      delete muted[id];
      delete loop[id];
      return { playbackRates, autoplay, muted, loop };
    });
  },

  getPlaybackRate: id => get().playbackRates[id] ?? 1,
  getAutoplay: id => get().autoplay[id] ?? false,
  getMuted: id => get().muted[id] ?? false,
  getLoop: id => get().loop[id] ?? false,
}));

/* Clear store data whenever the page-builder removes a component from the canvas */
document.addEventListener('pb:component-removed', (e: Event) => {
  const { componentId } = (e as CustomEvent<{ componentId: string }>).detail;
  useVideoStore.getState().clearComponent(componentId);
});
