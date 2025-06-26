// CustomRating.tsx - Using Zustand
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { useRatingStore } from '../store/RatingStore';

interface CustomRatingProps {
  componentId?: string;
}

const CustomRating = React.forwardRef<HTMLDivElement, CustomRatingProps>(
  (props, forwardedRef) => {
    const { componentId } = props;
    const currentComponentId = componentId || 'default';

    const value = useRatingStore(state => state.getRating(currentComponentId));
    const setValue = useRatingStore(state => state.setValue);
    const maxValue = 5;

    const handleChange = (
      event: React.SyntheticEvent<Element, Event>,
      newValue: number | null
    ) => {
      setValue(currentComponentId, newValue);
    };

    return (
      <Box
        ref={forwardedRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '200px',
          height: '100px',
          border: '2px dashed #94a3b8',
          borderRadius: '8px',
          backgroundColor: '#f1f5f9',
          fontFamily: 'sans-serif',
          fontSize: '14px',
          color: '#64748b',
          margin: '10px',
          padding: '5px',
        }}
      >
        <Typography component="legend">Controlled Rating</Typography>
        <Rating
          name="simple-controlled"
          value={value}
          max={maxValue}
          onChange={handleChange}
        />
        <Typography variant="body2">
          Current Value: {value !== null ? value : 'N/A'}
        </Typography>
      </Box>
    );
  }
);

export default CustomRating;
