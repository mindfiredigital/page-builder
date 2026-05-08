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

  getPlaybackRate: id => get().playbackRates[id] ?? 1,
  getAutoplay: id => get().autoplay[id] ?? false,
  getMuted: id => get().muted[id] ?? false,
  getLoop: id => get().loop[id] ?? false,
}));
