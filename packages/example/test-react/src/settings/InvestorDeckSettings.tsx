import * as React from 'react';
import {
  Box,
  Typography,
  TextField,
  Divider,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

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
import { useInvestorDeckStore, DEFAULTS } from '../store/InvestorDeckStore';

interface InvestorDeckSettingsProps {
  targetComponentId: string;
}

const accordionSx = {
  border: '1px solid #e2e8f0',
  borderRadius: '6px !important',
  '&:before': { display: 'none' },
};
const summarySx = {
  minHeight: 36,
  py: 0,
  px: 1.5,
  '& .MuiAccordionSummary-content': { my: 0 },
};
const detailsSx = {
  pt: 0,
  px: 1.5,
  pb: 1.5,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};
const labelSx = { fontSize: '12px', fontWeight: 600, color: '#334155' };
const fieldProps = {
  size: 'small' as const,
  fullWidth: true,
  inputProps: { style: { fontSize: '12px' } },
  InputLabelProps: { style: { fontSize: '12px' } },
};

const InvestorDeckSettings = React.forwardRef<
  HTMLDivElement,
  InvestorDeckSettingsProps
>(({ targetComponentId }, ref) => {
  const settings = useInvestorDeckStore(
    state => state.settings[targetComponentId] ?? DEFAULTS
  );
  const set = useInvestorDeckStore(state => state.set);

  const update = (patch: Parameters<typeof set>[1]) =>
    set(targetComponentId, patch);

  return (
    <Box
      ref={ref}
      sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, color: '#334155', fontSize: '12px' }}
      >
        Investor Deck — {targetComponentId}
      </Typography>
      <Divider />

      {/* ── Branding ── */}
      <Accordion disableGutters defaultExpanded elevation={0} sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
          <Typography sx={labelSx}>Branding</Typography>
        </AccordionSummary>
        <AccordionDetails sx={detailsSx}>
          <TextField
            {...fieldProps}
            label="Company Name"
            value={settings.companyName}
            onChange={e => update({ companyName: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="Industry"
            value={settings.industry}
            onChange={e => update({ industry: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="Tagline"
            value={settings.tagline}
            onChange={e => update({ tagline: e.target.value })}
            multiline
            rows={2}
          />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '12px', color: '#64748b', flex: 1 }}>
              Primary Color
            </Typography>
            <input
              type="color"
              value={settings.primaryColor}
              onChange={e => update({ primaryColor: e.target.value })}
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
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '12px', color: '#64748b', flex: 1 }}>
              Secondary Color
            </Typography>
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={e => update({ secondaryColor: e.target.value })}
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

      {/* ── Capital Raise ── */}
      <Accordion disableGutters elevation={0} sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
          <Typography sx={labelSx}>Capital Raise</Typography>
        </AccordionSummary>
        <AccordionDetails sx={detailsSx}>
          <TextField
            {...fieldProps}
            label="Ask Amount"
            value={settings.askAmount}
            onChange={e => update({ askAmount: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="Human Capital"
            value={settings.humanCapital}
            onChange={e => update({ humanCapital: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="Product Refinement"
            value={settings.productRefinement}
            onChange={e => update({ productRefinement: e.target.value })}
          />
        </AccordionDetails>
      </Accordion>

      {/* ── Images ── */}
      <Accordion disableGutters elevation={0} sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
          <Typography sx={labelSx}>Images</Typography>
        </AccordionSummary>
        <AccordionDetails sx={detailsSx}>
          <TextField
            {...fieldProps}
            label="Solution Diagram URL"
            value={settings.imgSolutionDiagram}
            onChange={e => update({ imgSolutionDiagram: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="Software Framework URL"
            value={settings.imgSoftwareFramework}
            onChange={e => update({ imgSoftwareFramework: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="Team Photo URL"
            value={settings.imgTeam}
            onChange={e => update({ imgTeam: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="Acquisition 1 URL"
            value={settings.imgAcquisition1}
            onChange={e => update({ imgAcquisition1: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="Acquisition 2 URL"
            value={settings.imgAcquisition2}
            onChange={e => update({ imgAcquisition2: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="Acquisition 3 URL"
            value={settings.imgAcquisition3}
            onChange={e => update({ imgAcquisition3: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="Competitors Chart URL"
            value={settings.imgCompetitors}
            onChange={e => update({ imgCompetitors: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="Clients Logo Grid URL"
            value={settings.imgClients}
            onChange={e => update({ imgClients: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="ARR/Charts URL"
            value={settings.imgCharts}
            onChange={e => update({ imgCharts: e.target.value })}
          />
          <TextField
            {...fieldProps}
            label="Capital Raise Photo URL"
            value={settings.imgCapitalRaise}
            onChange={e => update({ imgCapitalRaise: e.target.value })}
          />
        </AccordionDetails>
      </Accordion>

      {/* ── Video ── */}
      <Accordion disableGutters elevation={0} sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
          <Typography sx={labelSx}>Video</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            pt: 0,
            px: 1.5,
            pb: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <TextField
            {...fieldProps}
            label="Video URL"
            value={settings.videoSrc}
            onChange={e => update({ videoSrc: e.target.value })}
            sx={{ mb: 0.5 }}
          />
          {(
            [
              ['videoAutoplay', 'Autoplay'],
              ['videoMuted', 'Muted'],
              ['videoLoop', 'Loop'],
              ['videoControls', 'Show Controls'],
              ['showVideo', 'Show Video Section'],
            ] as [keyof typeof settings, string][]
          ).map(([key, label]) => (
            <FormControlLabel
              key={key}
              control={
                <Switch
                  size="small"
                  checked={settings[key] as boolean}
                  onChange={e => update({ [key]: e.target.checked })}
                />
              }
              label={<Typography sx={{ fontSize: '12px' }}>{label}</Typography>}
              sx={{ ml: 0, mr: 0 }}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* ── Show / Hide Sections ── */}
      <Accordion disableGutters elevation={0} sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
          <Typography sx={labelSx}>Show / Hide Sections</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            pt: 0,
            px: 1.5,
            pb: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {(
            [
              ['showProblem', 'Problem Section'],
              ['showSolution', 'Solution Section'],
              ['showMarket', 'Target Market'],
              ['showGrowth', 'Growth Strategy'],
              ['showClients', 'Active Clients'],
              ['showCompetitors', 'Competitors'],
              ['showTeam', 'Team'],
              ['showCapitalRaise', 'Capital Raise'],
            ] as [keyof typeof settings, string][]
          ).map(([key, label]) => (
            <FormControlLabel
              key={key}
              control={
                <Switch
                  size="small"
                  checked={settings[key] as boolean}
                  onChange={e => update({ [key]: e.target.checked })}
                />
              }
              label={<Typography sx={{ fontSize: '12px' }}>{label}</Typography>}
              sx={{ ml: 0, mr: 0 }}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
});

InvestorDeckSettings.displayName = 'InvestorDeckSettings';

export default InvestorDeckSettings;
