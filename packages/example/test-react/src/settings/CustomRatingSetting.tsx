import * as React from 'react';
import { Box, Button, Typography } from '@mui/material'; // Using MUI components for consistent styling

interface CustomRatingSettingsProps {
  targetComponentId: string;
}

interface PageBuilderCustomSettingEventDetail {
  functionName: string;
  targetComponentId?: string;
}

interface PageBuilderCustomSettingEvent extends CustomEvent {
  detail: PageBuilderCustomSettingEventDetail;
}

const CustomRatingSettings: React.FC<CustomRatingSettingsProps> = ({
  targetComponentId,
}) => {
  const dispatchAction = React.useCallback(
    (functionName: string) => {
      if (!targetComponentId) {
        console.error('CustomRatingSettings: targetComponentId is missing.');
        return;
      }

      const event: PageBuilderCustomSettingEvent = new CustomEvent(
        'pagebuilder:custom-setting-action',
        {
          detail: {
            functionName: functionName,
            targetComponentId: targetComponentId,
          },
          bubbles: true,
          composed: true,
        }
      );

      document.dispatchEvent(event);
      console.log(
        `CustomRatingSettings: Dispatched event '${functionName}' for component ID: ${targetComponentId}`
      );
    },
    [targetComponentId]
  );

  return (
    <Box
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
        onClick={() => dispatchAction('resetRating')}
        sx={{ textTransform: 'none', borderRadius: '8px' }}
      >
        Reset Rating
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => dispatchAction('setRatingToMax')}
        sx={{ textTransform: 'none', borderRadius: '8px' }}
      >
        Set Max Rating
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => dispatchAction('incrementRating')}
        sx={{ textTransform: 'none', borderRadius: '8px' }}
      >
        Increment Rating
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => dispatchAction('decrementRating')}
        sx={{ textTransform: 'none', borderRadius: '8px' }}
      >
        Decrement Rating
      </Button>
    </Box>
  );
};

export default CustomRatingSettings;
