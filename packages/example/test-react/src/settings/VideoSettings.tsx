import * as React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { useVideoStore } from '../store/VideoStore';

interface VideoSettingsProps {
  targetComponentId: string;
}

/** Finds the <video> element inside the page-builder canvas component */
function getVideoEl(componentId: string): HTMLVideoElement | null {
  const container = document.getElementById(componentId);
  return container ? container.querySelector('video') : null;
}

const VideoSettings = React.forwardRef<HTMLDivElement, VideoSettingsProps>(
  ({ targetComponentId }, ref) => {
    const playbackRate = useVideoStore(state =>
      state.getPlaybackRate(targetComponentId)
    );
    const autoplay = useVideoStore(state =>
      state.getAutoplay(targetComponentId)
    );
    const muted = useVideoStore(state => state.getMuted(targetComponentId));
    const loop = useVideoStore(state => state.getLoop(targetComponentId));

    const setPlaybackRate = useVideoStore(state => state.setPlaybackRate);
    const setAutoplay = useVideoStore(state => state.setAutoplay);
    const setMuted = useVideoStore(state => state.setMuted);
    const setLoop = useVideoStore(state => state.setLoop);

    const handlePlaybackRate = (rate: number) => {
      setPlaybackRate(targetComponentId, rate);
      const el = getVideoEl(targetComponentId);
      if (el) el.playbackRate = rate;
    };

    const handleAutoplay = (value: boolean) => {
      setAutoplay(targetComponentId, value);
      const el = getVideoEl(targetComponentId);
      if (el) el.autoplay = value;
    };

    const handleMuted = (value: boolean) => {
      setMuted(targetComponentId, value);
      const el = getVideoEl(targetComponentId);
      if (el) el.muted = value;
    };

    const handleLoop = (value: boolean) => {
      setLoop(targetComponentId, value);
      const el = getVideoEl(targetComponentId);
      if (el) el.loop = value;
    };

    return (
      <Box
        ref={ref}
        sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: '#334155', fontSize: '12px' }}
        >
          Video Settings — {targetComponentId}
        </Typography>

        <Divider />

        <FormControl size="small" fullWidth>
          <InputLabel sx={{ fontSize: '12px' }}>Playback Speed</InputLabel>
          <Select
            value={playbackRate}
            label="Playback Speed"
            onChange={e => handlePlaybackRate(Number(e.target.value))}
            sx={{ fontSize: '12px' }}
          >
            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(r => (
              <MenuItem key={r} value={r} sx={{ fontSize: '12px' }}>
                {r}×
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={autoplay}
              onChange={e => handleAutoplay(e.target.checked)}
            />
          }
          label={<Typography sx={{ fontSize: '12px' }}>Autoplay</Typography>}
        />

        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={muted}
              onChange={e => handleMuted(e.target.checked)}
            />
          }
          label={<Typography sx={{ fontSize: '12px' }}>Muted</Typography>}
        />

        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={loop}
              onChange={e => handleLoop(e.target.checked)}
            />
          }
          label={<Typography sx={{ fontSize: '12px' }}>Loop</Typography>}
        />
      </Box>
    );
  }
);

export default VideoSettings;
