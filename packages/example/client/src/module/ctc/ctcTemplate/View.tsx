import {
  PageBuilderDesign,
  PageBuilderReact,
} from '@mindfiredigital/page-builder-react';
import {
  CompanyLogo,
  EmployeeName,
  FinancialYeatText,
  SalaryStructureTable,
  RetirementInsuranceTable,
  AnnualCTCDisplay,
  FooterNotes,
} from './TemplateComponents';
import { useEffect, useState } from 'react';
import {
  fetchCtcTemplate,
  updateCtcTemplate,
} from '../../../services/services';
import { useParams } from 'react-router-dom';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Container,
  // AppBar,
  Toolbar,
  IconButton,
  Stack,
  Switch,
} from '@mui/material';
import {
  ArrowBack,
  Build,
  Info,
  Publish,
  UnpublishedOutlined,
} from '@mui/icons-material';
import CtcDefinitionManager from './CtcDefinitionManager';

interface CtcTemplate {
  id: number;
  title: string;
  metadata: string;
  is_published: boolean;
  is_active: boolean;
  is_pf_required: boolean;
  created_at?: string;
  updated_at?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const View = () => {
  const { id } = useParams();
  const [currentTemplate, setCurrentTemplate] = useState<PageBuilderDesign>([]);
  const [templateInfo, setTemplateInfo] = useState<CtcTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const dynamicComponents = {
    Basic: ['button', 'header', 'text'],
    Extra: [],
  };
  console.log(templateInfo, 'template');

  const getData = async () => {
    try {
      setLoading(true);
      const templateData = await fetchCtcTemplate({ id: Number(id) });
      const template = templateData?.data?.templates?.[0];

      if (template) {
        setTemplateInfo(template);
        const metadata = template.metadata;
        if (metadata) {
          setCurrentTemplate(JSON.parse(metadata));
        } else {
          setCurrentTemplate([]);
        }
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handlePublishToggle = async () => {
    if (!templateInfo) return;

    try {
      const updatedTemplate = {
        ...templateInfo,
        is_published: templateInfo.is_published ? false : true,
      };

      await updateCtcTemplate(Number(id), updatedTemplate);
      setTemplateInfo(updatedTemplate);
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleActiveToggle = async () => {
    if (!templateInfo) return;

    try {
      const updatedTemplate = {
        ...templateInfo,
        is_active: templateInfo.is_active ? false : true,
      };

      await updateCtcTemplate(Number(id), updatedTemplate);
      setTemplateInfo(updatedTemplate);
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const customComponents = {
    companyLogo: {
      component: CompanyLogo,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2-icon lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`,
      title: 'Company Logo',
    },
    EmployeeName: {
      component: EmployeeName,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      title: 'Employee Name',
    },
    financialYearText: {
      component: FinancialYeatText,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar1-icon lucide-calendar-1"><path d="M11 14h1v4"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M8 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/></svg>`,
      title: 'Financial Year Text',
    },
    SalaryStructureTable: {
      component: SalaryStructureTable,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-grid3x3-icon lucide-grid-3x3"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>`,
      title: 'Salary Structure Table',
    },
    RetirementInsuranceTable: {
      component: RetirementInsuranceTable,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-plus-icon lucide-shield-plus"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>`,
      title: 'Retirement Insurance Table',
    },
    AnnualCTCDisplay: {
      component: AnnualCTCDisplay,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dollar-sign-icon lucide-circle-dollar-sign"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>`,
      title: 'Annual CTC Display',
    },
    FooterNotes: {
      component: FooterNotes,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
      title: 'Footer Notes',
    },
  };

  const getStatusChip = (isActive: boolean, isPublished: boolean) => {
    if (isPublished && isActive) {
      return <Chip label="Live" color="success" size="small" />;
    } else if (isPublished && !isActive) {
      return <Chip label="Published (Inactive)" color="warning" size="small" />;
    } else if (!isPublished && isActive) {
      return <Chip label="Draft (Active)" color="info" size="small" />;
    } else {
      return <Chip label="Draft" color="default" size="small" />;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ borderRadius: 0 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 } }}>
            <IconButton
              edge="start"
              onClick={() => window.history.back()}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                {templateInfo?.title || 'CTC Template'}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              {templateInfo?.is_published ? (
                <Switch
                  checked={Boolean(templateInfo?.is_active)}
                  disabled={!templateInfo?.is_published}
                  onChange={() => handleActiveToggle()}
                  inputProps={{ 'aria-label': 'active status' }}
                  className={`${!templateInfo?.is_published && 'cursor-not-allowed'} cu`}
                />
              ) : (
                ''
              )}
              <Button
                variant="contained"
                startIcon={
                  templateInfo?.is_published ? (
                    <UnpublishedOutlined />
                  ) : (
                    <Publish />
                  )
                }
                color={templateInfo?.is_published ? 'warning' : 'primary'}
                onClick={handlePublishToggle}
                size="small"
              >
                {templateInfo?.is_published ? 'Unpublish' : 'Publish'}
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </Paper>

      {/* Tabs */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="template tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
              },
            }}
          >
            <Tab
              icon={<Build />}
              iconPosition="start"
              label="Template Builder"
            />
            <Tab icon={<Info />} iconPosition="start" label="CTC Definitions" />
            <Tab
              icon={<Info />}
              iconPosition="start"
              label="Template Information"
            />
          </Tabs>
        </Container>
      </Paper>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <TabPanel value={activeTab} index={0}>
          <Container
            maxWidth={false}
            sx={{
              height: '100%',
              py: 2,
              px: { xs: 2, sm: 3 },
              maxWidth: '100vw',
            }}
          >
            <Paper
              elevation={2}
              sx={{
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                <PageBuilderReact
                  config={dynamicComponents}
                  customComponents={customComponents}
                  initialDesign={currentTemplate}
                  onChange={async (newDesign: any) => {
                    setCurrentTemplate(newDesign);
                    await updateCtcTemplate(Number(id), {
                      metadata: JSON.stringify(newDesign),
                    });
                  }}
                />
              </Box>
            </Paper>
          </Container>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <CtcDefinitionManager
              templateId={Number(id)}
              templateTitle={templateInfo?.title || 'Template'}
              onDefinitionsChange={definitions => {
                // Handle definitions change if needed
                console.log('Definitions updated:', definitions);
              }}
            />
          </Container>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Basic Information
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Template ID
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            #{templateInfo?.id}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Title
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {templateInfo?.title}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Status
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            {templateInfo &&
                              getStatusChip(
                                templateInfo.is_active,
                                templateInfo.is_published
                              )}
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            PF Required
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {templateInfo?.is_pf_required ? 'Yes' : 'No'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Template Configuration */}
              <Grid item xs={12}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Template Configuration
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, backgroundColor: 'grey.50', mt: 2 }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Page Builder Components Used:
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flexWrap: 'wrap', gap: 1 }}
                      >
                        {currentTemplate.length > 0 ? (
                          currentTemplate.map(
                            (component: any, index: number) => (
                              <Chip
                                key={index}
                                label={component.type || 'Unknown Component'}
                                variant="outlined"
                                size="small"
                                color="primary"
                              />
                            )
                          )
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No components configured
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default View;
