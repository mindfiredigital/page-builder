import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useRatingStore } from '../store/RatingStore';

interface CustomRatingSettingsProps {
  targetComponentId: string;
}

const CustomRatingSettings = React.forwardRef<
  unknown,
  CustomRatingSettingsProps
>((props, forwardedRef) => {
  const { targetComponentId } = props;

  console.log(targetComponentId, 'targetId');

  const resetRating = useRatingStore(state => state.resetRating);
  const setRatingToMax = useRatingStore(state => state.setRatingToMax);
  const incrementRating = useRatingStore(state => state.incrementRating);
  const decrementRating = useRatingStore(state => state.decrementRating);

  return (
    <Box
      ref={forwardedRef}
      sx={{
        p: 2,
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography variant="h6" component="h3" sx={{ mb: 1, fontSize: '1rem' }}>
        Rating Controls
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => resetRating(targetComponentId)}
        sx={{ textTransform: 'none', borderRadius: '8px' }}
      >
        Reset Rating
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setRatingToMax(targetComponentId)}
        sx={{ textTransform: 'none', borderRadius: '8px' }}
      >
        Set Max Rating
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => incrementRating(targetComponentId)}
        sx={{ textTransform: 'none', borderRadius: '8px' }}
      >
        Increment Rating
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => decrementRating(targetComponentId)}
        sx={{ textTransform: 'none', borderRadius: '8px' }}
      >
        Decrement Rating
      </Button>
    </Box>
  );
});

export default CustomRatingSettings;
