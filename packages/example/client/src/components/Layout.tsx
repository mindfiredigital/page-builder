import {
  Avatar,
  Backdrop,
  Chip,
  CircularProgress,
  Box,
  CssBaseline,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  Toolbar,
  styled,
  Typography,
  Tooltip,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Logout,
  Menu,
  DownloadingOutlined,
  Sync,
} from '@mui/icons-material';
import {
  APP_MENU,
  ICON,
  ROLE,
  ROUTE,
  SIDEBAR,
  LOCAL_STORAGE,
  APPRAISAL_TABLE_TYPE,
} from '../utils/constant';
import {
  appraisalList,
  paydataList,
  logout,
  sync,
  peopleCSV,
  leadCSV,
} from '../services/services';
import { AppBarProps } from '../types/types';
import MuiAppBar from '@mui/material/AppBar';
import Copyright from './Copyright';
import StageEllipse from './StageEllipse';
import AppMenu from './AppMenu';
import AppraisalMenu from './AppraisalMenu';
import PaydataMenu from './PaydataMenu';
import Image from './Image';
import Status from './Status';
import AppButton from './Button';
import CtcMenu from './CtcMenu';

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: 240,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open' && prop !== 'showDrawer',
})<AppBarProps>(({ theme, open, showDrawer }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: '100%',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open &&
    showDrawer && {
      marginLeft: 240,
      width: `calc(100% - ${240}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const defaultTheme = createTheme();

const Layout = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<{
    open: boolean;
    heading: React.ReactNode;
    data: { title: string; stage_title: string };
    loading: boolean;
    table: string;
  }>({
    open: true,
    heading: '',
    data: { title: '', stage_title: '' },
    loading: false,
    table:
      localStorage.getItem(LOCAL_STORAGE.ACTIVE_TABLE) ||
      String(APPRAISAL_TABLE_TYPE.ORIGINAL),
  });

  const location = useLocation();
  const { id } = useParams();

  const displayName = localStorage.getItem(LOCAL_STORAGE.DISPLAY_NAME);
  const role = localStorage.getItem(LOCAL_STORAGE.ROLE_ID);

  const paydata = location.pathname.includes(
    `${ROUTE.PAYDATA}/${id}${ROUTE.TRANSACTION}`
  );
  const appraisal = location.pathname.includes(
    `${ROUTE.APPRAISAL}/${id}${ROUTE.PEOPLE}`
  );
  const isPaydataRoute = location.pathname.includes(`${ROUTE.PAYDATA}/`);
  const isAppraisalRoute = location.pathname.includes(`${ROUTE.APPRAISAL}/`);
  const isCtcTemplateRoute = location.pathname.includes(
    `${ROUTE.CTC_TEMPLATE}`
  );
  const peopleRoute = location.pathname === `${ROUTE.PEOPLE}`;
  const ctcRoute = location.pathname === `${ROUTE.CTC}`;
  const admin = Number(role) === ROLE.ADMIN;
  const account = Number(role) === ROLE.ACCOUNT;
  const manager = Number(role) === ROLE.MANAGER;
  const contributor = Number(role) === ROLE.CONTRIBUTOR;
  const shouldRenderDrawer =
    admin ||
    account ||
    ((manager || contributor) && (isPaydataRoute || isAppraisalRoute));

  useEffect(() => {
    const handleStorageChange = () => {
      setState(prev => ({
        ...prev,
        table:
          localStorage.getItem(LOCAL_STORAGE.ACTIVE_TABLE) ||
          String(APPRAISAL_TABLE_TYPE.ORIGINAL),
      }));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    let headingContent: React.ReactNode = '';

    switch (true) {
      case appraisal:
        headingContent = (
          <>
            {state.data?.title} <StageEllipse stage={state.data?.stage_title} />
          </>
        );
        break;
      case location.pathname.includes(`${ROUTE.APPRAISAL}/${id}${ROUTE.USER}`):
        headingContent = (
          <>
            {SIDEBAR.APPRAISAL_USER} (
            {state.data?.title || localStorage.getItem(LOCAL_STORAGE.TITLE)})
          </>
        );
        break;
      case location.pathname.includes(
        `${ROUTE.APPRAISAL}/${id}${ROUTE.SETTING}`
      ):
        headingContent = (
          <>
            {SIDEBAR.APPRAISAL_SETTING} (
            {state.data?.title || localStorage.getItem(LOCAL_STORAGE.TITLE)})
          </>
        );
        break;

      case state.data?.title && paydata:
        headingContent = (
          <>
            {state.data?.title} <StageEllipse stage={state.data?.stage_title} />
          </>
        );
        break;
      case location.pathname.includes(
        `${ROUTE.PAYDATA}/${id}${ROUTE.SCHEDULE}`
      ):
        headingContent = (
          <>
            {SIDEBAR.PAYDATA_SCHEDULE} (
            {state.data?.title || localStorage.getItem(LOCAL_STORAGE.TITLE)})
          </>
        );
        break;
      case location.pathname.includes(`${ROUTE.PAYDATA}/${id}${ROUTE.USER}`):
        headingContent = (
          <>
            {SIDEBAR.PAYDATA_USER} (
            {state.data?.title || localStorage.getItem(LOCAL_STORAGE.TITLE)})
          </>
        );
        break;
      case location.pathname.includes(`${ROUTE.PAYDATA}/${id}${ROUTE.SETTING}`):
        headingContent = (
          <>
            {SIDEBAR.PAYDATA_SETTING} (
            {state.data?.title || localStorage.getItem(LOCAL_STORAGE.TITLE)})
          </>
        );
        break;

      case location.pathname === ROUTE.APPRAISAL:
        headingContent = APP_MENU.APPRAISAL_TITLE;
        break;
      case location.pathname === ROUTE.PAYDATA:
        headingContent = APP_MENU.PAYDATA_TITLE;
        break;
      case location.pathname === ROUTE.USER:
        headingContent = APP_MENU.USER_TITLE;
        break;
      case location.pathname === ROUTE.PEOPLE:
        headingContent = APP_MENU.PEOPLE_TITLE;
        break;
      case location.pathname === ROUTE.CTC:
        headingContent = APP_MENU.CTC;
        break;
      case location.pathname === ROUTE.AUDIT_LOG:
        headingContent = APP_MENU.AUDIT_LOG_TITLE;
        break;
      default:
        headingContent = APP_MENU.DASHBORD;
        break;
    }

    setState(prev => ({ ...prev, heading: headingContent }));
  }, [
    location.pathname,
    state.data?.title,
    id,
    appraisal,
    paydata,
    state.data?.stage_title,
  ]);

  const fetchData = useCallback(async () => {
    if (!id) return;

    setState(prev => ({ ...prev, loading: true }));

    const response = paydata
      ? await paydataList(1, 1, '', [], Number(id))
      : await appraisalList(1, 1, '', [], Number(id));

    if (response?.success) {
      const data = paydata
        ? response?.data?.paydatas[0]
        : response?.data?.appraisals[0];
      setState(prev => ({ ...prev, data }));

      if (data?.title) {
        localStorage.setItem(LOCAL_STORAGE.TITLE, data.title);
      }
    }

    setState(prev => ({ ...prev, loading: false }));
  }, [paydata, id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (paydata || appraisal) {
        fetchData();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [paydata, appraisal, fetchData]);

  const handleLogout = async () => {
    const session_token = localStorage.getItem(LOCAL_STORAGE.SESSION_TOKEN);
    if (!session_token) return;

    setState(prev => ({ ...prev, loading: true }));

    const response = await logout({ session_token });
    if (response?.success) {
      localStorage.clear();
      window.location.replace(ROUTE.LOGIN);
    }
    setState(prev => ({ ...prev, loading: false }));
  };

  const uploadCSV = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, people: boolean) => {
      const fileInput = event.target;
      const file: File | undefined = fileInput.files?.[0];
      if (!file) return;

      setState(prev => ({ ...prev, loading: true }));

      const response = people ? await peopleCSV(file) : await leadCSV(file);
      if (response?.success) {
        toast.success(response.message, { duration: 4000 });
        window.dispatchEvent(new Event('storage'));
      }

      setState(prev => ({ ...prev, loading: false }));
      fileInput.value = '';
    },
    []
  );

  const peopleSync = async () => {
    setState(prev => ({ ...prev, loading: true }));

    const response = await sync();
    if (response?.success) {
      toast.success(response.message, { duration: 2000 });
      window.dispatchEvent(new Event('storage'));
    }

    setState(prev => ({ ...prev, loading: false }));
  };

  const toggleDrawer = (type: 'toggle' | 'icon') => {
    setState(prev => ({ ...prev, open: type === 'toggle' }));
  };

  const renderMenu = () => {
    if (isPaydataRoute) return <PaydataMenu />;
    if (isAppraisalRoute) return <AppraisalMenu />;
    if (isCtcTemplateRoute) return <CtcMenu />;
    return <AppMenu />;
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {state.loading && (
          <Backdrop open={true} sx={{ zIndex: 1300, color: '#fff' }}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}

        <AppBar
          position="absolute"
          open={state.open && (admin || account)}
          showDrawer={true}
        >
          <Toolbar
            sx={{
              pr: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '20px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {(admin || account) && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={() => toggleDrawer('toggle')}
                  sx={{
                    marginRight: '36px',
                    ...(state.open && { display: 'none' }),
                  }}
                >
                  <Menu />
                </IconButton>
              )}
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    imagePath={ICON.MINDFIRE_FIRE_ICON}
                    sx={{
                      width: { xs: 25, sm: 35, md: 45 },
                      height: { xs: 24, sm: 35, md: 45 },
                    }}
                  />
                  <div>{state.heading}</div>
                </div>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {(paydata || appraisal) && <Status />}

              {ctcRoute && (
                <AppButton
                  id="ctcTemplate"
                  label="ctc template"
                  onClick={() => {
                    navigate(ROUTE.CTC_TEMPLATE);
                  }}
                  textColor="primary"
                  backgroundColor="#2E7D32"
                  type="button"
                  tabIndex={1}
                />
              )}
              {peopleRoute && (
                <>
                  <Tooltip title="Import Lead">
                    <IconButton
                      onClick={() => document.getElementById('lead')?.click()} // Trigger file input
                      sx={{
                        color: '#fff',
                        background: '#E65100',
                        '&:hover': { background: '#BF360C' },
                      }}
                      aria-label="import-lead"
                    >
                      <DownloadingOutlined />
                    </IconButton>
                  </Tooltip>

                  <input
                    type="file"
                    id="lead"
                    accept=".csv"
                    style={{ display: 'none' }}
                    onChange={event => uploadCSV(event, false)}
                  />

                  <Tooltip title="Import People">
                    <IconButton
                      onClick={() => document.getElementById('people')?.click()} // Trigger file input
                      sx={{
                        color: '#fff',
                        background: '#6A1B9A',
                        '&:hover': { background: '#4A148C' },
                      }}
                      aria-label="import-people"
                    >
                      <DownloadingOutlined />
                    </IconButton>
                  </Tooltip>

                  <input
                    type="file"
                    id="people"
                    accept=".csv"
                    style={{ display: 'none' }}
                    onChange={event => uploadCSV(event, true)}
                  />

                  <Tooltip title="Sync People & Lead">
                    <IconButton
                      onClick={peopleSync}
                      sx={{
                        color: '#fff',
                        background: '#2E7D32',
                        '&:hover': { background: '#1B5E20' },
                      }}
                      aria-label="sync"
                    >
                      <Sync />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {manager && appraisal && (
                <Tooltip title="Sync People & Lead">
                  <IconButton
                    onClick={peopleSync}
                    sx={{
                      color: '#fff',
                      background: '#2E7D32',
                      '&:hover': { background: '#1B5E20' },
                    }}
                    aria-label="sync"
                  >
                    <Sync />
                  </IconButton>
                </Tooltip>
              )}

              {displayName && (
                <Chip
                  avatar={
                    <Avatar>{displayName.charAt(0).toUpperCase()}</Avatar>
                  }
                  label={
                    <span style={{ color: '#fff', textTransform: 'uppercase' }}>
                      {displayName}
                    </span>
                  }
                />
              )}
              <Tooltip title="Signout">
                <IconButton
                  onClick={handleLogout}
                  color="inherit"
                  sx={{ ml: 2 }}
                  aria-label="logout"
                >
                  <Logout />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {shouldRenderDrawer && (
          <Drawer variant="permanent" open={state.open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
                height: '20px',
              }}
            >
              <IconButton onClick={() => toggleDrawer('icon')}>
                <ChevronLeft />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">{renderMenu()}</List>
          </Drawer>
        )}

        <Box
          component="main"
          sx={{
            backgroundColor: theme =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            width: Number(role) === ROLE.ADMIN ? undefined : '100%',
          }}
        >
          <Toolbar />
          <Box
            sx={{
              padding: '20px',
              maxWidth:
                Number(role) === ROLE.ADMIN ? undefined : '100% !important',
            }}
          >
            <Outlet />
          </Box>
          <Copyright sx={{ mt: 2, mb: 2 }} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
