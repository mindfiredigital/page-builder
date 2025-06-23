// store/RatingStore.tsx
import * as React from 'react';

interface RatingActions {
  resetRating: (componentId: string) => void;
  setRatingToMax: (componentId: string) => void;
  incrementRating: (componentId: string) => void;
  decrementRating: (componentId: string) => void;
  setValue: (componentId: string, value: number | null) => void;
}

interface RatingState {
  ratings: Record<string, number | null>;
  actions: RatingActions;
}

const RatingContext = React.createContext<RatingState | null>(null);

export const RatingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ratings, setRatings] = React.useState<Record<string, number | null>>(
    {}
  );

  const actions: RatingActions = React.useMemo(
    () => ({
      resetRating: (componentId: string) => {
        setRatings(prev => ({ ...prev, [componentId]: 0 }));
        console.log(`Rating (${componentId}): Reset to 0`);
      },

      setRatingToMax: (componentId: string) => {
        setRatings(prev => ({ ...prev, [componentId]: 5 }));
        console.log(`Rating (${componentId}): Set to max (5)`);
      },

      incrementRating: (componentId: string) => {
        setRatings(prev => {
          const current = prev[componentId] ?? 2;
          const newValue = Math.min(current + 1, 5);
          console.log(`Rating (${componentId}): Incremented to ${newValue}`);
          return { ...prev, [componentId]: newValue };
        });
      },

      decrementRating: (componentId: string) => {
        setRatings(prev => {
          const current = prev[componentId] ?? 2;
          const newValue = Math.max(current - 1, 0);
          console.log(`Rating (${componentId}): Decremented to ${newValue}`);
          return { ...prev, [componentId]: newValue };
        });
      },

      setValue: (componentId: string, value: number | null) => {
        setRatings(prev => ({ ...prev, [componentId]: value }));
      },
    }),
    []
  );

  return (
    <RatingContext.Provider value={{ ratings, actions }}>
      {children}
    </RatingContext.Provider>
  );
};

export const useRatingStore = () => {
  const context = React.useContext(RatingContext);
  if (!context) {
    throw new Error('useRatingStore must be used within RatingProvider');
  }
  return context;
};
