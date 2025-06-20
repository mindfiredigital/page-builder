import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

interface PageBuilderCustomSettingEventDetail {
  functionName: string;
  targetComponentId?: string;
}

interface PageBuilderCustomSettingEvent extends CustomEvent {
  detail: PageBuilderCustomSettingEventDetail;
}

interface CustomRatingProps {
  componentId?: string;
}

const CustomRating = React.forwardRef<HTMLDivElement, CustomRatingProps>(
  (props, forwardedRef) => {
    const { componentId } = props;

    const [value, setValue] = React.useState<number | null>(2);
    const maxValue = 5;

    const currentComponentId = componentId || null;

    const resetRating = React.useCallback((): void => {
      setValue(0);
      console.log(`CustomRating (${currentComponentId}): Rating Reset to 0`);
    }, [currentComponentId]);

    const setRatingToMax = React.useCallback((): void => {
      if (maxValue !== null) {
        setValue(maxValue);
        console.log(
          `CustomRating (${currentComponentId}): Rating set to ${maxValue}`
        );
      }
    }, [maxValue, currentComponentId]);

    const incrementRating = React.useCallback((): void => {
      setValue(prev => {
        const currentVal = prev !== null ? prev : 0;
        const maxVal = maxValue !== null ? maxValue : 5;
        const newValue = Math.min(currentVal + 1, maxVal);
        console.log(
          `CustomRating (${currentComponentId}): Rating incremented to`,
          newValue
        );
        return newValue;
      });
    }, [maxValue, currentComponentId]);

    const decrementRating = React.useCallback((): void => {
      setValue(prev => {
        const currentVal = prev !== null ? prev : 0;
        const newValue = Math.max(currentVal - 1, 0);
        console.log(
          `CustomRating (${currentComponentId}): Rating decremented to`,
          newValue
        );
        return newValue;
      });
    }, [currentComponentId]);

    React.useEffect(() => {
      if (!currentComponentId) {
        console.warn(
          'CustomRating: No componentId prop received. Event listener not attached.'
        );
        return;
      }

      console.log(
        `CustomRating: Component ready with ID: ${currentComponentId}`
      );

      const handleCustomSettingAction = (
        event: PageBuilderCustomSettingEvent
      ): void => {
        if (event.detail.targetComponentId !== currentComponentId) {
          console.log(
            `CustomRating (${currentComponentId}): Ignoring event for ${event.detail.targetComponentId}`
          );
          return;
        }

        console.log(
          `CustomRating (${currentComponentId}): Event received for this instance:`,
          event.detail.functionName
        );
        const { functionName } = event.detail;

        switch (functionName) {
          case 'resetRating':
            resetRating();
            break;
          case 'setRatingToMax':
            setRatingToMax();
            break;
          case 'incrementRating':
            incrementRating();
            break;
          case 'decrementRating':
            decrementRating();
            break;
          default:
            console.warn(
              `CustomRating (${currentComponentId}): Unknown functionName received: ${functionName}`
            );
        }
      };

      document.addEventListener(
        'pagebuilder:custom-setting-action',
        handleCustomSettingAction as EventListener
      );

      return () => {
        document.removeEventListener(
          'pagebuilder:custom-setting-action',
          handleCustomSettingAction as EventListener
        );
      };
    }, []);

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
          max={maxValue !== null ? maxValue : undefined}
          onChange={(
            event: React.SyntheticEvent<Element, Event>,
            newValue: number | null
          ) => {
            setValue(newValue);
          }}
        />
        <Typography variant="body2">
          Current Value: {value !== null ? value : 'N/A'}
        </Typography>
      </Box>
    );
  }
);

export default CustomRating;
