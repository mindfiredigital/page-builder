import {
  Divider,
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { People, ArrowBack } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_MENU, APPRAISAL_MENU, CTC_MENU, ROUTE } from '../utils/constant';

const CtcMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (name: string) => {
    switch (name) {
      case CTC_MENU.CTC_TEMPLATE:
        navigate(`${ROUTE.CTC_TEMPLATE}`);
        break;
      default:
        navigate(ROUTE.CTC);
        break;
    }
  };

  return (
    <>
      <ListItemButton onClick={() => handleNavigation(CTC_MENU.CTC_TEMPLATE)}>
        <ListItemIcon>
          <People />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              fontWeight={
                location.pathname === `${ROUTE.CTC_TEMPLATE}`
                  ? APP_MENU.BOLD
                  : APP_MENU.NORMAL
              }
            >
              {APP_MENU.CTC_TEMPLATE}
            </Typography>
          }
        />
      </ListItemButton>

      <Divider sx={{ my: 1 }} />
      <ListItemButton
        onClick={() => handleNavigation(APPRAISAL_MENU.BACK_TO_MENU)}
      >
        <ListItemIcon>
          <ArrowBack />
        </ListItemIcon>
        <ListItemText primary={APP_MENU.BACK_TITLE} />
      </ListItemButton>
    </>
  );
};

export default CtcMenu;
