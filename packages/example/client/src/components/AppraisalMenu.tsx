import { Divider, Typography, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { People, ManageAccounts, Settings, ArrowBack } from "@mui/icons-material";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { APP_MENU, APPRAISAL_MENU, LOCAL_STORAGE, ROLE, ROUTE } from "../utils/constant";

const AppraisalMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const role = localStorage.getItem(LOCAL_STORAGE.ROLE_ID);
    const account = Number(role) === ROLE.ACCOUNT;
    const manager = Number(role) === ROLE.MANAGER;
    const contributor = Number(role) === ROLE.CONTRIBUTOR;

    const handleNavigation = (name: string) => {
        switch (name) {
            case APPRAISAL_MENU.APPRAISAL_PEOPLE:
                navigate(`${ROUTE.APPRAISAL}/${id}${ROUTE.PEOPLE}`);
                break;
            case APPRAISAL_MENU.APPRAISAL_USER:
                navigate(`${ROUTE.APPRAISAL}/${id}${ROUTE.USER}`);
                break;
            case APPRAISAL_MENU.APPRAISAL_SETTING:
                navigate(`${ROUTE.APPRAISAL}/${id}${ROUTE.SETTING}`);
                break;
            case APPRAISAL_MENU.BACK_TO_MENU:
                navigate(ROUTE.APPRAISAL);
                break;
            default:
                navigate(ROUTE.APPRAISAL);
                break;
        };
    };

    return (
        <>
            <ListItemButton onClick={() => handleNavigation(APPRAISAL_MENU.APPRAISAL_PEOPLE)}>
                <ListItemIcon>
                    <People />
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Typography fontWeight={location.pathname === `${ROUTE.APPRAISAL}/${id}${ROUTE.PEOPLE}` ? APP_MENU.BOLD : APP_MENU.NORMAL}>
                            {APP_MENU.PEOPLE_TITLE}
                        </Typography>
                    }
                />
            </ListItemButton>

            {(!account && !manager && !contributor) && (
                <>
                    <ListItemButton onClick={() => handleNavigation(APPRAISAL_MENU.APPRAISAL_USER)}>
                        <ListItemIcon>
                            <ManageAccounts />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography fontWeight={location.pathname === `${ROUTE.APPRAISAL}/${id}${ROUTE.USER}` ? APP_MENU.BOLD : APP_MENU.NORMAL}>
                                    {APP_MENU.USER_TITLE}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleNavigation(APPRAISAL_MENU.APPRAISAL_SETTING)}>
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography fontWeight={location.pathname === `${ROUTE.APPRAISAL}/${id}${ROUTE.SETTING}` ? APP_MENU.BOLD : APP_MENU.NORMAL}>
                                    {APP_MENU.SETTING_TITLE}
                                </Typography>
                            }
                        />
                    </ListItemButton>

                </>
            )}
            <Divider sx={{ my: 1 }} />
            <ListItemButton onClick={() => handleNavigation(APPRAISAL_MENU.BACK_TO_MENU)}>
                <ListItemIcon>
                    <ArrowBack />
                </ListItemIcon>
                <ListItemText primary={APP_MENU.BACK_TITLE} />
            </ListItemButton>
        </>
    );
};

export default AppraisalMenu;