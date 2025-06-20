import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Insights,
  CurrencyRupee,
  ManageAccounts,
  People,
  History,
  MonetizationOn,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_MENU, LOCAL_STORAGE, ROLE, ROUTE } from '../utils/constant';

const AppMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem(LOCAL_STORAGE.ROLE_ID);
  const account = Number(role) === ROLE.ACCOUNT;

  const handleNavigation = (name: string) => {
    switch (name) {
      case APP_MENU.APPRAISAL:
        navigate(ROUTE.APPRAISAL);
        break;
      case APP_MENU.PAYDATA:
        navigate(ROUTE.PAYDATA);
        break;
      case APP_MENU.CTC:
        navigate(ROUTE.CTC);
        break;
      case APP_MENU.USERS:
        navigate(ROUTE.USER);
        break;
      case APP_MENU.PEOPLE:
        navigate(ROUTE.PEOPLE);
        break;
      case APP_MENU.AUDIT_LOG:
        navigate(ROUTE.AUDIT_LOG);
        break;
      default:
        navigate(ROUTE.APPRAISAL);
        break;
    }
  };

  return (
    <>
      <ListItemButton onClick={() => handleNavigation(APP_MENU.APPRAISAL)}>
        <ListItemIcon>
          <Insights />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              fontWeight={
                location.pathname === ROUTE.APPRAISAL
                  ? APP_MENU.BOLD
                  : APP_MENU.NORMAL
              }
            >
              {APP_MENU.APPRAISAL_TITLE}
            </Typography>
          }
        />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigation(APP_MENU.PAYDATA)}>
        <ListItemIcon>
          <CurrencyRupee />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              fontWeight={
                location.pathname === ROUTE.PAYDATA
                  ? APP_MENU.BOLD
                  : APP_MENU.NORMAL
              }
            >
              {APP_MENU.PAYDATA_TITLE}
            </Typography>
          }
        />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigation(APP_MENU.CTC)}>
        <ListItemIcon>
          <MonetizationOn />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              fontWeight={
                location.pathname === ROUTE.CTC
                  ? APP_MENU.BOLD
                  : APP_MENU.NORMAL
              }
            >
              {APP_MENU.CTC}
            </Typography>
          }
        />
      </ListItemButton>

      {!account && (
        <>
          <ListItemButton onClick={() => handleNavigation(APP_MENU.USERS)}>
            <ListItemIcon>
              <ManageAccounts />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  fontWeight={
                    location.pathname === ROUTE.USER
                      ? APP_MENU.BOLD
                      : APP_MENU.NORMAL
                  }
                >
                  {APP_MENU.USER_TITLE}
                </Typography>
              }
            />
          </ListItemButton>

          <ListItemButton onClick={() => handleNavigation(APP_MENU.PEOPLE)}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  fontWeight={
                    location.pathname === ROUTE.PEOPLE
                      ? APP_MENU.BOLD
                      : APP_MENU.NORMAL
                  }
                >
                  {APP_MENU.PEOPLE_TITLE}
                </Typography>
              }
            />
          </ListItemButton>

          <ListItemButton onClick={() => handleNavigation(APP_MENU.AUDIT_LOG)}>
            <ListItemIcon>
              <History />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  fontWeight={
                    location.pathname === ROUTE.AUDIT_LOG
                      ? APP_MENU.BOLD
                      : APP_MENU.NORMAL
                  }
                >
                  {APP_MENU.AUDIT_LOG_TITLE}
                </Typography>
              }
            />
          </ListItemButton>
        </>
      )}
    </>
  );
};

export default AppMenu;
