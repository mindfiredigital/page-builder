import * as React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Divider,
} from '@mui/material';
import { useImageStore } from '../store/ImageStore';

interface ImageSettingsProps {
  targetComponentId: string;
}

const ImageSettings = React.forwardRef<HTMLDivElement, ImageSettingsProps>(
  ({ targetComponentId }, ref) => {
    const altText = useImageStore(state => state.getAltText(targetComponentId));
    const objectFit = useImageStore(state =>
      state.getObjectFit(targetComponentId)
    );
    const caption = useImageStore(state => state.getCaption(targetComponentId));

    const setAltText = useImageStore(state => state.setAltText);
    const setObjectFit = useImageStore(state => state.setObjectFit);
    const setCaption = useImageStore(state => state.setCaption);

    return (
      <Box
        ref={ref}
        sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: '#334155', fontSize: '12px' }}
        >
          Image Settings — {targetComponentId}
        </Typography>

        <Divider />

        <TextField
          size="small"
          label="Alt Text"
          value={altText}
          onChange={e => setAltText(targetComponentId, e.target.value)}
          inputProps={{ style: { fontSize: '12px' } }}
          InputLabelProps={{ style: { fontSize: '12px' } }}
          fullWidth
        />

        <FormControl size="small" fullWidth>
          <InputLabel sx={{ fontSize: '12px' }}>Object Fit</InputLabel>
          <Select
            value={objectFit}
            label="Object Fit"
            onChange={e => setObjectFit(targetComponentId, e.target.value)}
            sx={{ fontSize: '12px' }}
          >
            {['contain', 'cover', 'fill', 'none', 'scale-down'].map(f => (
              <MenuItem key={f} value={f} sx={{ fontSize: '12px' }}>
                {f}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Caption"
          value={caption}
          onChange={e => setCaption(targetComponentId, e.target.value)}
          inputProps={{ style: { fontSize: '12px' } }}
          InputLabelProps={{ style: { fontSize: '12px' } }}
          fullWidth
          multiline
          rows={2}
        />
      </Box>
    );
  }
);

export default ImageSettings;
