import * as React from 'react';
import {
  Box,
  Typography,
  TextField,
  Divider,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useVideoStore, VIDEO_DEFAULTS } from '../store/VideoStore';

const ExpandMoreIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

interface VideoSettingsProps {
  targetComponentId: string;
}

const accSx = {
  border: '1px solid #e2e8f0',
  borderRadius: '6px !important',
  '&:before': { display: 'none' },
};
const sumSx = {
  minHeight: 36,
  py: 0,
  px: 1.5,
  '& .MuiAccordionSummary-content': { my: 0 },
};
const detSx = {
  pt: 0,
  px: 1.5,
  pb: 1.5,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};
const labelSx = { fontSize: '12px', fontWeight: 600, color: '#334155' };
const fp = {
  size: 'small' as const,
  fullWidth: true,
  inputProps: { style: { fontSize: '12px' } },
  InputLabelProps: { style: { fontSize: '12px' } },
};

const BOX_SHADOW_PRESETS = [
  { label: 'None', value: 'none' },
  { label: 'Soft', value: '0 2px 8px rgba(0,0,0,0.08)' },
  { label: 'Card', value: '0 4px 16px rgba(0,0,0,0.12)' },
  { label: 'Deep', value: '0 8px 32px rgba(0,0,0,0.2)' },
];

const VideoSettings = React.forwardRef<HTMLDivElement, VideoSettingsProps>(
  ({ targetComponentId }, ref) => {
    const s = useVideoStore(
      state => state.settings[targetComponentId] ?? VIDEO_DEFAULTS
    );
    const set = useVideoStore(state => state.set);
    const u = (patch: Partial<typeof s>) => set(targetComponentId, patch);

    return (
      <Box
        ref={ref}
        sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: '#334155', fontSize: '12px' }}
        >
          Video — {targetComponentId}
        </Typography>
        <Divider />

        {/* ── Source ── */}
        <Accordion disableGutters defaultExpanded elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Source</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
            <TextField
              {...fp}
              label="Video URL"
              placeholder="https://... or /video.mp4"
              value={s.src.startsWith('data:') ? '' : s.src}
              onChange={e => u({ src: e.target.value })}
            />
            <TextField
              {...fp}
              label="Poster Image URL"
              value={s.posterUrl}
              onChange={e => u({ posterUrl: e.target.value })}
            />
          </AccordionDetails>
        </Accordion>

        {/* ── Playback ── */}
        <Accordion disableGutters elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Playback</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
            <FormControl {...fp}>
              <InputLabel>Playback Speed</InputLabel>
              <Select
                value={s.playbackRate}
                label="Playback Speed"
                onChange={e => u({ playbackRate: Number(e.target.value) })}
                sx={{ fontSize: '12px' }}
              >
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(r => (
                  <MenuItem key={r} value={r} sx={{ fontSize: '12px' }}>
                    {r}×
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {(
              [
                ['controls', 'Show Controls'],
                ['autoplay', 'Autoplay'],
                ['muted', 'Muted'],
                ['loop', 'Loop'],
              ] as [keyof typeof s, string][]
            ).map(([key, label]) => (
              <FormControlLabel
                key={key}
                control={
                  <Switch
                    size="small"
                    checked={s[key] as boolean}
                    onChange={e => u({ [key]: e.target.checked })}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '12px' }}>{label}</Typography>
                }
                sx={{ ml: 0 }}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* ── Display ── */}
        <Accordion disableGutters elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Display</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
            <FormControl {...fp}>
              <InputLabel>Object Fit</InputLabel>
              <Select
                value={s.objectFit}
                label="Object Fit"
                onChange={e => u({ objectFit: e.target.value as any })}
                sx={{ fontSize: '12px' }}
              >
                {['contain', 'cover', 'fill'].map(f => (
                  <MenuItem key={f} value={f} sx={{ fontSize: '12px' }}>
                    {f}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography sx={{ fontSize: '11px', color: '#64748b' }}>
              Border Radius: {s.borderRadius}px
            </Typography>
            <Slider
              min={0}
              max={100}
              value={s.borderRadius}
              onChange={(_, v) => u({ borderRadius: v as number })}
              size="small"
            />
            <Typography sx={{ fontSize: '11px', color: '#64748b' }}>
              Opacity: {Math.round(s.opacity * 100)}%
            </Typography>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={s.opacity}
              onChange={(_, v) => u({ opacity: v as number })}
              size="small"
            />
          </AccordionDetails>
        </Accordion>

        {/* ── Size & Spacing ── */}
        <Accordion disableGutters elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Size & Spacing</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
            {/* Width */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                size="small"
                type="number"
                label="Width"
                fullWidth
                value={s.widthValue}
                onChange={e =>
                  u({ widthValue: Math.max(0, Number(e.target.value)) })
                }
                inputProps={{ style: { fontSize: '12px' }, min: 0 }}
                InputLabelProps={{ style: { fontSize: '12px' } }}
              />
              <FormControl size="small" sx={{ minWidth: 60 }}>
                <Select
                  value={s.widthUnit}
                  onChange={e => u({ widthUnit: e.target.value as 'px' | '%' })}
                  sx={{ fontSize: '12px' }}
                >
                  <MenuItem value="px" sx={{ fontSize: '12px' }}>
                    px
                  </MenuItem>
                  <MenuItem value="%" sx={{ fontSize: '12px' }}>
                    %
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* Height */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                size="small"
                type="number"
                label="Height"
                fullWidth
                value={s.heightValue}
                onChange={e =>
                  u({ heightValue: Math.max(0, Number(e.target.value)) })
                }
                inputProps={{ style: { fontSize: '12px' }, min: 0 }}
                InputLabelProps={{ style: { fontSize: '12px' } }}
              />
              <FormControl size="small" sx={{ minWidth: 60 }}>
                <Select
                  value={s.heightUnit}
                  onChange={e =>
                    u({ heightUnit: e.target.value as 'px' | '%' })
                  }
                  sx={{ fontSize: '12px' }}
                >
                  <MenuItem value="px" sx={{ fontSize: '12px' }}>
                    px
                  </MenuItem>
                  <MenuItem value="%" sx={{ fontSize: '12px' }}>
                    %
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* Padding */}
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#64748b',
                mt: 0.5,
              }}
            >
              Padding
            </Typography>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}
            >
              {(['Top', 'Right', 'Bottom', 'Left'] as const).map(side => {
                const key = `padding${side}` as
                  | 'paddingTop'
                  | 'paddingRight'
                  | 'paddingBottom'
                  | 'paddingLeft';
                return (
                  <TextField
                    key={key}
                    size="small"
                    type="number"
                    label={side}
                    value={s[key]}
                    onChange={e =>
                      u({ [key]: Math.max(0, Number(e.target.value)) })
                    }
                    inputProps={{ style: { fontSize: '12px' }, min: 0 }}
                    InputLabelProps={{ style: { fontSize: '12px' } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                            px
                          </span>
                        </InputAdornment>
                      ),
                    }}
                  />
                );
              })}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ── Shadow ── */}
        <Accordion disableGutters elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Shadow</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {BOX_SHADOW_PRESETS.map(p => (
                <Box
                  key={p.label}
                  onClick={() => u({ boxShadow: p.value })}
                  sx={{
                    px: 1,
                    py: 0.25,
                    fontSize: '11px',
                    border: '1px solid',
                    borderRadius: 1,
                    cursor: 'pointer',
                    borderColor:
                      s.boxShadow === p.value ? '#6366f1' : '#e2e8f0',
                    color: s.boxShadow === p.value ? '#6366f1' : '#334155',
                    bgcolor:
                      s.boxShadow === p.value ? '#eef2ff' : 'transparent',
                  }}
                >
                  {p.label}
                </Box>
              ))}
            </Box>
            <TextField
              {...fp}
              label="Box Shadow (CSS)"
              value={s.boxShadow}
              onChange={e => u({ boxShadow: e.target.value })}
            />
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  }
);

VideoSettings.displayName = 'VideoSettings';
export default VideoSettings;
