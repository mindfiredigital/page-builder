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
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { useTextStore, TEXT_DEFAULTS } from '../store/TextStore';

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

interface TextSettingsProps {
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

const FONT_FAMILIES = [
  'Inter, -apple-system, sans-serif',
  'Arial, sans-serif',
  'Georgia, serif',
  'Verdana, sans-serif',
  '"Times New Roman", serif',
  '"Courier New", monospace',
  'Trebuchet MS, sans-serif',
  '"Palatino Linotype", serif',
  'Impact, sans-serif',
];

const FONT_WEIGHTS = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
];

const TEXT_SHADOW_PRESETS = [
  { label: 'None', value: 'none' },
  { label: 'Soft', value: '1px 1px 4px rgba(0,0,0,0.2)' },
  { label: 'Medium', value: '2px 2px 6px rgba(0,0,0,0.35)' },
  { label: 'Hard', value: '3px 3px 0px rgba(0,0,0,0.5)' },
  { label: 'Glow', value: '0 0 10px rgba(99,102,241,0.7)' },
];

const BOX_SHADOW_PRESETS = [
  { label: 'None', value: 'none' },
  { label: 'Soft', value: '0 2px 8px rgba(0,0,0,0.08)' },
  { label: 'Card', value: '0 4px 16px rgba(0,0,0,0.12)' },
  { label: 'Deep', value: '0 8px 32px rgba(0,0,0,0.2)' },
  { label: 'Inset', value: 'inset 0 2px 6px rgba(0,0,0,0.15)' },
];

const TextSettings = React.forwardRef<HTMLDivElement, TextSettingsProps>(
  ({ targetComponentId }, ref) => {
    const s = useTextStore(
      state => state.settings[targetComponentId] ?? TEXT_DEFAULTS
    );
    const set = useTextStore(state => state.set);
    const u = (patch: Partial<typeof s>) => set(targetComponentId, patch);

    /* Immediately writes the chosen color to the outer custom-element wrapper so
     that the HTML-preview generator can read it via style.color even before the
     60ms debounce fires and React re-renders the inner div.  This mirrors how
     default text components work (applyTextColor sets element.style.color
     synchronously), ensuring the preview always shows the user's latest pick. */
    const syncColor = (color: string) => {
      const el = document.getElementById(targetComponentId);
      if (el instanceof HTMLElement) el.style.color = color;
    };

    /* Debounce color-picker updates so dragging the color wheel doesn't trigger
     a full re-render of all 8 MUI accordions on every mouse-move event. */
    const colorTimer = React.useRef<ReturnType<typeof setTimeout>>();
    const uc = (patch: Partial<typeof s>) => {
      clearTimeout(colorTimer.current);
      colorTimer.current = setTimeout(() => u(patch), 60);
    };

    // When the content has been enriched with HTML (e.g. bullet lists), show a
    // plain-text version in the textarea so the user doesn't see raw HTML tags.
    // Editing the textarea replaces the HTML with plain text (list structure is
    // discarded; re-apply it via the List buttons below).
    const plainContent = React.useMemo(() => {
      if (!s.content.includes('<')) return s.content;
      try {
        const tmp = document.createElement('div');
        tmp.innerHTML = s.content;
        return tmp.innerText;
      } catch {
        return s.content;
      }
    }, [s.content]);

    // Apply an unordered or ordered list to the currently-selected text in the
    // canvas inner div.  onMouseDown + preventDefault on the caller button keeps
    // the canvas focus/selection alive while the sidebar button is clicked.
    const applyList = (type: 'insertUnorderedList' | 'insertOrderedList') => {
      const outerEl = document.getElementById(targetComponentId);
      const innerDiv = outerEl?.querySelector(
        '[contenteditable="true"]'
      ) as HTMLElement | null;
      if (!innerDiv) return;
      if (document.activeElement !== innerDiv) innerDiv.focus();
      document.execCommand(type);
      u({ content: innerDiv.innerHTML });
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
          Text — {targetComponentId}
        </Typography>
        <Divider />

        {/* ── Content ── */}
        <Accordion disableGutters defaultExpanded elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Content</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
            <TextField
              {...fp}
              label="Text Content"
              value={plainContent}
              onChange={e => u({ content: e.target.value })}
              multiline
              rows={4}
            />
          </AccordionDetails>
        </Accordion>

        {/* ── Typography ── */}
        <Accordion disableGutters defaultExpanded elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Typography</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
            <FormControl {...fp}>
              <InputLabel>Font Family</InputLabel>
              <Select
                value={s.fontFamily}
                label="Font Family"
                onChange={e => u({ fontFamily: e.target.value })}
                sx={{ fontSize: '12px' }}
              >
                {FONT_FAMILIES.map(f => (
                  <MenuItem
                    key={f}
                    value={f}
                    sx={{ fontSize: '12px', fontFamily: f }}
                  >
                    {f.split(',')[0]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                label="Size (px)"
                type="number"
                value={s.fontSize}
                onChange={e => u({ fontSize: Number(e.target.value) })}
                inputProps={{ min: 8, max: 200, style: { fontSize: '12px' } }}
                InputLabelProps={{ style: { fontSize: '12px' } }}
                sx={{ flex: 1 }}
              />
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel sx={{ fontSize: '12px' }}>Weight</InputLabel>
                <Select
                  value={s.fontWeight}
                  label="Weight"
                  onChange={e => u({ fontWeight: e.target.value })}
                  sx={{ fontSize: '12px' }}
                >
                  {FONT_WEIGHTS.map(w => (
                    <MenuItem key={w} value={w} sx={{ fontSize: '12px' }}>
                      {w}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <ToggleButtonGroup
              value={s.textAlign}
              exclusive
              onChange={(_, v) => v && u({ textAlign: v })}
              size="small"
              fullWidth
            >
              {['left', 'center', 'right', 'justify'].map(a => (
                <ToggleButton
                  key={a}
                  value={a}
                  sx={{ fontSize: '11px', py: 0.5 }}
                >
                  {a[0].toUpperCase()}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel sx={{ fontSize: '12px' }}>Transform</InputLabel>
                <Select
                  value={s.textTransform}
                  label="Transform"
                  onChange={e => u({ textTransform: e.target.value as any })}
                  sx={{ fontSize: '12px' }}
                >
                  {['none', 'uppercase', 'lowercase', 'capitalize'].map(v => (
                    <MenuItem key={v} value={v} sx={{ fontSize: '12px' }}>
                      {v}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel sx={{ fontSize: '12px' }}>Decoration</InputLabel>
                <Select
                  value={s.textDecoration}
                  label="Decoration"
                  onChange={e => u({ textDecoration: e.target.value as any })}
                  sx={{ fontSize: '12px' }}
                >
                  {['none', 'underline', 'line-through', 'overline'].map(v => (
                    <MenuItem key={v} value={v} sx={{ fontSize: '12px' }}>
                      {v}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={s.fontStyle === 'italic'}
                  onChange={e =>
                    u({ fontStyle: e.target.checked ? 'italic' : 'normal' })
                  }
                />
              }
              label={<Typography sx={{ fontSize: '12px' }}>Italic</Typography>}
              sx={{ ml: 0 }}
            />
          </AccordionDetails>
        </Accordion>

        {/* ── List ── */}
        <Accordion disableGutters elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>List</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
            <Typography sx={{ fontSize: '11px', color: '#64748b' }}>
              Select lines in the canvas first, then click a button to toggle
              list formatting.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                fullWidth
                onMouseDown={e => e.preventDefault()}
                onClick={() => applyList('insertUnorderedList')}
                sx={{ fontSize: '11px', py: 0.5, textTransform: 'none' }}
              >
                • Bullet List
              </Button>
              <Button
                size="small"
                variant="outlined"
                fullWidth
                onMouseDown={e => e.preventDefault()}
                onClick={() => applyList('insertOrderedList')}
                sx={{ fontSize: '11px', py: 0.5, textTransform: 'none' }}
              >
                1. Ordered List
              </Button>
            </Box>
            <Button
              size="small"
              variant="outlined"
              color="error"
              fullWidth
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                const outerEl = document.getElementById(targetComponentId);
                const innerDiv = outerEl?.querySelector(
                  '[contenteditable="true"]'
                ) as HTMLElement | null;
                if (!innerDiv) return;
                // innerText strips all HTML tags and gives plain text with \n for line breaks.
                // Storing this removes all list structure; white-space: pre-wrap on the div
                // will still render the \n characters as visible line breaks.
                const plainText = innerDiv.innerText;
                u({ content: plainText });
              }}
              sx={{ fontSize: '11px', py: 0.5, textTransform: 'none' }}
            >
              Remove List
            </Button>
          </AccordionDetails>
        </Accordion>

        {/* ── Colors ── */}
        <Accordion disableGutters elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Colors</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '12px', color: '#64748b', flex: 1 }}>
                Text Color
              </Typography>
              <input
                type="color"
                value={s.color}
                onChange={e => {
                  syncColor(e.target.value);
                  uc({ color: e.target.value });
                }}
                style={{
                  width: 32,
                  height: 32,
                  border: '1px solid #e2e8f0',
                  borderRadius: 4,
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
              <TextField
                size="small"
                value={s.color}
                onChange={e => {
                  syncColor(e.target.value);
                  u({ color: e.target.value });
                }}
                inputProps={{ style: { fontSize: '11px', width: 72 } }}
                sx={{ width: 90 }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '12px', color: '#64748b', flex: 1 }}>
                Background
              </Typography>
              <input
                type="color"
                value={
                  s.backgroundColor === 'transparent'
                    ? '#ffffff'
                    : s.backgroundColor
                }
                onChange={e => uc({ backgroundColor: e.target.value })}
                style={{
                  width: 32,
                  height: 32,
                  border: '1px solid #e2e8f0',
                  borderRadius: 4,
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
              <TextField
                size="small"
                value={s.backgroundColor}
                onChange={e => u({ backgroundColor: e.target.value })}
                inputProps={{ style: { fontSize: '11px', width: 72 } }}
                sx={{ width: 90 }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ── Spacing ── */}
        <Accordion disableGutters elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Spacing</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
            <Typography sx={{ fontSize: '11px', color: '#64748b' }}>
              Line Height: {s.lineHeight}
            </Typography>
            <Slider
              min={0.8}
              max={4}
              step={0.05}
              value={s.lineHeight}
              onChange={(_, v) => u({ lineHeight: v as number })}
              size="small"
            />
            <Typography sx={{ fontSize: '11px', color: '#64748b' }}>
              Letter Spacing: {s.letterSpacing}px
            </Typography>
            <Slider
              min={-5}
              max={20}
              step={0.5}
              value={s.letterSpacing}
              onChange={(_, v) => u({ letterSpacing: v as number })}
              size="small"
            />
            <Typography sx={{ fontSize: '11px', color: '#64748b' }}>
              Word Spacing: {s.wordSpacing}px
            </Typography>
            <Slider
              min={-5}
              max={30}
              step={1}
              value={s.wordSpacing}
              onChange={(_, v) => u({ wordSpacing: v as number })}
              size="small"
            />
          </AccordionDetails>
        </Accordion>

        {/* ── Padding ── */}
        <Accordion disableGutters elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Padding</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              pt: 0,
              px: 1.5,
              pb: 1.5,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
            }}
          >
            {(
              [
                ['paddingTop', 'Top'],
                ['paddingRight', 'Right'],
                ['paddingBottom', 'Bottom'],
                ['paddingLeft', 'Left'],
              ] as const
            ).map(([k, label]) => (
              <TextField
                key={k}
                size="small"
                label={label}
                type="number"
                value={s[k]}
                onChange={e => u({ [k]: Number(e.target.value) })}
                inputProps={{ min: 0, max: 200, style: { fontSize: '12px' } }}
                InputLabelProps={{ style: { fontSize: '12px' } }}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* ── Border ── */}
        <Accordion disableGutters elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Border</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                label="Width (px)"
                type="number"
                value={s.borderWidth}
                onChange={e => u({ borderWidth: Number(e.target.value) })}
                inputProps={{ min: 0, max: 20, style: { fontSize: '12px' } }}
                InputLabelProps={{ style: { fontSize: '12px' } }}
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                label="Radius (px)"
                type="number"
                value={s.borderRadius}
                onChange={e => u({ borderRadius: Number(e.target.value) })}
                inputProps={{ min: 0, max: 100, style: { fontSize: '12px' } }}
                InputLabelProps={{ style: { fontSize: '12px' } }}
                sx={{ flex: 1 }}
              />
            </Box>
            <FormControl {...fp}>
              <InputLabel>Style</InputLabel>
              <Select
                value={s.borderStyle}
                label="Style"
                onChange={e => u({ borderStyle: e.target.value as any })}
                sx={{ fontSize: '12px' }}
              >
                {['none', 'solid', 'dashed', 'dotted', 'double'].map(v => (
                  <MenuItem key={v} value={v} sx={{ fontSize: '12px' }}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '12px', color: '#64748b', flex: 1 }}>
                Border Color
              </Typography>
              <input
                type="color"
                value={s.borderColor}
                onChange={e => uc({ borderColor: e.target.value })}
                style={{
                  width: 32,
                  height: 32,
                  border: '1px solid #e2e8f0',
                  borderRadius: 4,
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ── Effects ── */}
        <Accordion disableGutters elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Effects</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
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

            <Typography sx={{ fontSize: '11px', color: '#64748b', mb: 0.5 }}>
              Text Shadow
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {TEXT_SHADOW_PRESETS.map(p => (
                <Box
                  key={p.label}
                  onClick={() => u({ textShadow: p.value })}
                  sx={{
                    px: 1,
                    py: 0.25,
                    fontSize: '11px',
                    border: '1px solid',
                    borderRadius: 1,
                    cursor: 'pointer',
                    borderColor:
                      s.textShadow === p.value ? '#6366f1' : '#e2e8f0',
                    color: s.textShadow === p.value ? '#6366f1' : '#334155',
                    bgcolor:
                      s.textShadow === p.value ? '#eef2ff' : 'transparent',
                  }}
                >
                  {p.label}
                </Box>
              ))}
            </Box>
            <TextField
              {...fp}
              label="Text Shadow (CSS)"
              value={s.textShadow}
              onChange={e => u({ textShadow: e.target.value })}
            />

            <Typography sx={{ fontSize: '11px', color: '#64748b', mb: 0.5 }}>
              Box Shadow
            </Typography>
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

        {/* ── Layout ── */}
        <Accordion disableGutters elevation={0} sx={accSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sumSx}>
            <Typography sx={labelSx}>Layout</Typography>
          </AccordionSummary>
          <AccordionDetails sx={detSx}>
            <TextField
              {...fp}
              label="Max Width (e.g. 100%, 600px)"
              value={s.maxWidth}
              onChange={e => u({ maxWidth: e.target.value })}
            />
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  }
);

TextSettings.displayName = 'TextSettings';
export default TextSettings;
