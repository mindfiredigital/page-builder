import { create } from 'zustand';

export interface TextSettings {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through' | 'overline';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  color: string;
  backgroundColor: string;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  borderWidth: number;
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  borderColor: string;
  borderRadius: number;
  textShadow: string;
  boxShadow: string;
  opacity: number;
  maxWidth: string;
}

export const TEXT_DEFAULTS: TextSettings = {
  content: 'Your text here',
  fontFamily: 'Inter, -apple-system, sans-serif',
  fontSize: 16,
  fontWeight: '400',
  fontStyle: 'normal',
  textDecoration: 'none',
  textTransform: 'none',
  textAlign: 'left',
  color: '#111827',
  backgroundColor: 'transparent',
  lineHeight: 1.6,
  letterSpacing: 0,
  wordSpacing: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  borderWidth: 0,
  borderStyle: 'solid',
  borderColor: '#e2e8f0',
  borderRadius: 0,
  textShadow: 'none',
  boxShadow: 'none',
  opacity: 1,
  maxWidth: '100%',
};

interface TextState {
  settings: Record<string, TextSettings>;
  set: (id: string, patch: Partial<TextSettings>) => void;
  clearComponent: (id: string) => void;
}

export const useTextStore = create<TextState>(setState => ({
  settings: {},

  set: (id, patch) =>
    setState(state => ({
      settings: {
        ...state.settings,
        [id]: { ...(state.settings[id] ?? TEXT_DEFAULTS), ...patch },
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
  // Skip if an element with the same ID already exists in the DOM — this
  // happens during restoreState() which clears the canvas and re-creates
  // components with the same IDs. Clearing the store here would wipe out
  // settings that were just restored by the new component's useLayoutEffect.
  if (!document.getElementById(componentId)) {
    useTextStore.getState().clearComponent(componentId);
  }
});

// After any settings change, trigger a canvas state save so data-pb-settings
// (written by the component's useLayoutEffect) is captured in localStorage.
let _saveTimer: ReturnType<typeof setTimeout> | undefined;
useTextStore.subscribe((newState, oldState) => {
  if (newState.settings !== oldState.settings) {
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('table-design-change'));
    }, 150);
  }
});
