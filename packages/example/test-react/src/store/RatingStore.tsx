import { create } from 'zustand';

interface RatingState {
  ratings: Record<string, number | null>;
  resetRating: (componentId: string) => void;
  setRatingToMax: (componentId: string) => void;
  incrementRating: (componentId: string) => void;
  decrementRating: (componentId: string) => void;
  setValue: (componentId: string, value: number | null) => void;
  getRating: (componentId: string) => number | null;
}

export const useRatingStore = create<RatingState>((set, get) => ({
  ratings: {},

  resetRating: (componentId: string) => {
    set(state => ({
      ratings: { ...state.ratings, [componentId]: 0 },
    }));
    console.log(`Rating (${componentId}): Reset to 0`);
  },

  setRatingToMax: (componentId: string) => {
    set(state => ({
      ratings: { ...state.ratings, [componentId]: 5 },
    }));
    console.log(`Rating (${componentId}): Set to max (5)`);
  },

  incrementRating: (componentId: string) => {
    const current = get().ratings[componentId] ?? 2;
    const newValue = Math.min(current + 1, 5);
    set(state => ({
      ratings: { ...state.ratings, [componentId]: newValue },
    }));
    console.log(`Rating (${componentId}): Incremented to ${newValue}`);
  },

  decrementRating: (componentId: string) => {
    const current = get().ratings[componentId] ?? 2;
    const newValue = Math.max(current - 1, 0);
    set(state => ({
      ratings: { ...state.ratings, [componentId]: newValue },
    }));
    console.log(`Rating (${componentId}): Decremented to ${newValue}`);
  },

  setValue: (componentId: string, value: number | null) => {
    set(state => ({
      ratings: { ...state.ratings, [componentId]: value },
    }));
  },

  getRating: (componentId: string) => {
    return get().ratings[componentId] ?? 2;
  },
}));
