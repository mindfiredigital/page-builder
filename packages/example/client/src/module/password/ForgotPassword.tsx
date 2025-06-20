import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CssBaseline, Grid, Typography, Paper, Link } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ROUTE, URL, ICON, LOGIN } from "../../utils/constant";
import { resetPassword } from "../../services/services";
import { createHandleChange, validateField } from "../../utils/validation";
import { FormDataProps, DynamicFormData } from "../../types/types";
import Copyright from "../../components/Copyright";
import { toast } from "sonner";
import Image from "../../components/Image";
import Input from "../../components/Input";
import AppButton from "../../components/Button";

const defaultTheme = createTheme();

const initialState: FormDataProps<DynamicFormData> = {
    values: { email: "" },
    errors: { email: "" },
    loading: false,
};

const ForgotPassword = () => {
    const [state, setState] = useState<FormDataProps<DynamicFormData>>(initialState);
    const navigate = useNavigate();
    const handleChange = createHandleChange<DynamicFormData>(setState);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = {
            email: validateField("emailOrUsername", state.values.email)
        };

        if (Object.values(errors).some(error => error)) {
            setState(prev => ({ ...prev, errors }));
            return;
        };

        const payload = {
            email: state.values.email
        };

        setState(prev => ({ ...prev, loading: true }));

        const response = await resetPassword(payload);
        if (response?.success) {
            toast.success(response.message, { duration: 2000 });
            setTimeout(() => {
                navigate(ROUTE.LOGIN);
            }, 2000);
        };
        setState(prev => ({ ...prev, loading: false }));
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: "100vh" }}>
                <CssBaseline />
                <Grid item xs={false} container sm={4} md={7}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${URL.BG_AUTH})`,
                            backgroundColor: (t) => t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundPosition: "left",
                        }}
                    >
                        <Image
                            imageUrl={URL.MINDFIRE_LOGO_LINK}
                            sx={{
                                width: { xs: 60, sm: 120, md: 150 },
                                height: { xs: 40, sm: 80, md: 100 },
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Image
                            imagePath={ICON.MINDFIRE_FIRE_ICON}
                            sx={{
                                width: { xs: 30, sm: 50, md: 80 },
                                height: { xs: 30, sm: 50, md: 80 },
                            }}
                        />
                        <Typography component="h1" variant="h5">
                            PULSE FINANCE
                        </Typography>

                        <Box sx={{ margin: true ? `${8}px 0` : `0 ${12}px` }} />

                        <Input
                            id="email"
                            label="Username or Email"
                            name="email"
                            type="text"
                            maxLength={50}
                            value={state.values.email}
                            disabled={state.loading}
                            error={!!state.errors.email}
                            errorText={state.errors.email}
                            onChange={handleChange}
                            tabIndex={1}
                        />

                        <AppButton
                            id="button"
                            type="submit"
                            label="Submit"
                            onClick={handleResetPassword}
                            loading={state.loading}
                            disabled={state.loading}
                            tabIndex={2}
                        />

                        <Grid container>
                            <Grid item xs>
                                <Link href={ROUTE.LOGIN}>
                                    {LOGIN.LOGIN}
                                </Link>
                            </Grid>
                        </Grid>
                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default ForgotPassword;
