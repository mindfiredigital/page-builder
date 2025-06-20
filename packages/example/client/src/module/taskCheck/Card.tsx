import { Backdrop, Box, CircularProgress, CssBaseline, Card, CardContent, Grid, Paper, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { APPRAISAL_TABLE_TYPE, ICON, LOCAL_STORAGE, ROUTE } from "../../utils/constant";
import { taskList } from "../../services/services";
import Image from "../../components/Image";

const defaultTheme = createTheme();

const TaskCard = ({ item, borderColor, onClick, showTitle }: any) => (
    <Card
        onClick={() => onClick(item.id, showTitle)}
        sx={{
            border: `1px solid ${borderColor}`,
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
                border: `2px solid ${borderColor}`,
                boxShadow: `0 4px 12px ${borderColor}`,
                transform: "translateY(-2px)",
            },
            overflow: "hidden",
            textAlign: "center"
        }}
    >
        <div
            style={{
                backgroundColor: showTitle
                    ? "rgba(3, 105, 161, 1)"
                    : "rgba(4, 120, 87, 1)",
                color: "#fff",
                padding: "8px 0"
            }}
        >
            {showTitle ? 'Appraisal' : 'Paydata'}
        </div>
        <CardContent>
            <Typography variant="h6" component="div" align="center">
                {item.title}
            </Typography>
        </CardContent>
    </Card>
);

const renderTaskCards = (tasks: any[], borderColor: string, onCardClick: (id: number, isAppraisal: boolean) => void, appraisal: boolean) => (
    tasks.length > 0 && tasks.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
            <TaskCard item={item} borderColor={borderColor} onClick={onCardClick} showTitle={appraisal} />
        </Grid>
    ))
);

const AppCard = () => {
    const [state, setState] = useState({
        loading: false,
        hasTask: false,
        appraisalTask: [],
        paydataTask: []
    });
    const navigate = useNavigate();
    const user_id = localStorage.getItem(LOCAL_STORAGE.USER_ID);

    const fetchData = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true }));

        if (!user_id) return;

        const response = await taskList(Number(user_id));

        if (response?.success) {
            setState((prev) => ({
                ...prev,
                hasTask: true,
                appraisalTask: response?.data?.appraisalTasks,
                paydataTask: response?.data?.paydataTasks
            }));
        }

        setState((prev) => ({ ...prev, loading: false }));
    }, [user_id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 100);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleCardClick = (id: number, isAppraisal: boolean) => {
        localStorage.setItem(LOCAL_STORAGE.ACTIVE_TABLE, String(APPRAISAL_TABLE_TYPE.REVISION));

        if (!id) return;

        if (isAppraisal) {
            navigate(`${ROUTE.APPRAISAL}/${id}${ROUTE.PEOPLE}`);
        } else {
            navigate(`${ROUTE.PAYDATA}/${id}${ROUTE.TRANSACTION}`);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Box
                sx={{
                    height: "50vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    backgroundColor: "#f4f6f8",
                }}
            >
                {state.appraisalTask.length > 0 || state.paydataTask.length > 0 ? (
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            maxWidth: "800px",
                            width: "100%",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="h3"
                            gutterBottom
                            sx={{ textAlign: "center" }}
                        >
                            Hello User
                        </Typography>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                            You are assigned to the following activities
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            {renderTaskCards(state.appraisalTask, "rgba(3, 105, 161, 1)", handleCardClick, true)}
                            {renderTaskCards(state.paydataTask, "rgba(4, 120, 87, 1)", handleCardClick, false)}
                        </Grid>
                    </Paper>
                ) : (
                    !state.loading && (
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                maxWidth: "600px",
                                width: "100%",
                                backgroundColor: "#fff",
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="h4" gutterBottom>
                                Hello User
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                Rest easy, No action required
                            </Typography>
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Image
                                    imagePath={ICON.MINDFIRE_FIRE_ICON}
                                    sx={{
                                        width: { xs: 60, sm: 120, md: 150 },
                                        height: { xs: 60, sm: 120, md: 150 },
                                    }}
                                />
                            </Box>
                            <Typography variant="subtitle1">Team Finance</Typography>
                        </Paper>
                    )
                )}
                <Backdrop
                    open={state.loading}
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>
        </ThemeProvider>
    );
};

export default AppCard;