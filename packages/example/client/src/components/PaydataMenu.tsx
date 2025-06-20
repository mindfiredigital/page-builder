import { Divider, Typography, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { People, Schedule, ManageAccounts, Settings, ArrowBack } from "@mui/icons-material";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { APP_MENU, APPRAISAL_MENU, PAYDATA_MENU, ROUTE, LOCAL_STORAGE, ROLE } from "../utils/constant";

const PaydataMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const role = localStorage.getItem(LOCAL_STORAGE.ROLE_ID);
    const account = Number(role) === ROLE.ACCOUNT;
    const manager = Number(role) === ROLE.MANAGER;
    const contributor = Number(role) === ROLE.CONTRIBUTOR;

    const handleNavigation = (name: string) => {
        switch (name) {
            case PAYDATA_MENU.PAYDATA_PEOPLE:
                navigate(`${ROUTE.PAYDATA}/${id}${ROUTE.TRANSACTION}`);
                break;
            case PAYDATA_MENU.PAYDATA_SCHEDULE:
                navigate(`${ROUTE.PAYDATA}/${id}${ROUTE.SCHEDULE}`);
                break;
            case PAYDATA_MENU.PAYDATA_USER:
                navigate(`${ROUTE.PAYDATA}/${id}${ROUTE.USER}`);
                break;
            case PAYDATA_MENU.PAYDATA_SETTING:
                navigate(`${ROUTE.PAYDATA}/${id}${ROUTE.SETTING}`);
                break;
            case PAYDATA_MENU.BACK_TO_MAIN:
                navigate(ROUTE.PAYDATA);
                break;
            default:
                navigate(ROUTE.PAYDATA);
                break;
        };
    };

    return (
        <>
            <ListItemButton onClick={() => handleNavigation(PAYDATA_MENU.PAYDATA_PEOPLE)}>
                <ListItemIcon>
                    <People />
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Typography fontWeight={location.pathname === `${ROUTE.PAYDATA}/${id}${ROUTE.TRANSACTION}` ? APP_MENU.BOLD : APP_MENU.NORMAL}>
                            {APP_MENU.TRANSACTION_TITLE}
                        </Typography>
                    }
                />
            </ListItemButton>
            {!account && (
                <>
                    <ListItemButton onClick={() => handleNavigation(PAYDATA_MENU.PAYDATA_SCHEDULE)}>
                        <ListItemIcon>
                            <Schedule />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography fontWeight={location.pathname === `${ROUTE.PAYDATA}/${id}${ROUTE.SCHEDULE}` ? APP_MENU.BOLD : APP_MENU.NORMAL}>
                                    {APP_MENU.SCHEDULE_TITLE}
                                </Typography>
                            }
                        />
                    </ListItemButton>

                    {(!manager && !contributor) && (
                        <>
                            <ListItemButton onClick={() => handleNavigation(PAYDATA_MENU.PAYDATA_USER)}>
                                <ListItemIcon>
                                    <ManageAccounts />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography fontWeight={location.pathname === `${ROUTE.PAYDATA}/${id}${ROUTE.USER}` ? APP_MENU.BOLD : APP_MENU.NORMAL}>
                                            {APP_MENU.USER_TITLE}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>

                            <ListItemButton onClick={() => handleNavigation(PAYDATA_MENU.PAYDATA_SETTING)}>
                                <ListItemIcon>
                                    <Settings />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography fontWeight={location.pathname === `${ROUTE.PAYDATA}/${id}${ROUTE.SETTING}` ? APP_MENU.BOLD : APP_MENU.NORMAL}>
                                            {APP_MENU.SETTING_TITLE}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </>
                    )}
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

export default PaydataMenu;