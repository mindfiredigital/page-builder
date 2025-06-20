import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CssBaseline, Grid, Typography, Paper, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ROUTE, URL, ICON } from "../../utils/constant";
import { verifyPassword } from "../../services/services";
import { createHandleChange } from "../../utils/validation";
import { FormDataProps, DynamicFormData } from "../../types/types";
import { toast } from "sonner";
import Copyright from "../../components/Copyright";
import Image from "../../components/Image";
import Input from "../../components/Input";
import AppButton from "../../components/Button";

const defaultTheme = createTheme();

const initialState: FormDataProps<DynamicFormData> = {
    values: { password: "", confirmPassword: "" },
    errors: { password: "", confirmPassword: "" },
    loading: false,
};

const VerifyPassword = () => {
    const [state, setState] = useState<FormDataProps<DynamicFormData>>(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const handleChange = createHandleChange<DynamicFormData>(setState);
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };
    const query = useQuery();
    const token = query.get("token");

    const passwordVisibility = () => setShowPassword(prev => !prev);
    const confirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

    const handleVerifyPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = {
            password: !state.values.password ? "Password is required" :
                      state.values.password.length < 8 ? "Password must be at least 8 characters long" : "",
            confirmPassword: !state.values.confirmPassword ? "Confirm Password is required" :
                             state.values.confirmPassword !== state.values.password ? "Confirm Passwords do not match" : "",
        };

        if (Object.values(errors).some(error => error)) {
            setState(prev => ({ ...prev, errors }));
            return;
        };

        if (!token) {
            toast.error("Invalid Request");
            return;
        };

        const payload = {
            reset_token: token,
            password: state.values.password
        };

        setState(prev => ({ ...prev, loading: true }));

        const response = await verifyPassword(payload);
        if (response?.success) {
            toast.success(response.message, { duration: 2000 });
            setTimeout(() => {
                navigate(ROUTE.LOGIN);
            }, 3000);
        }
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

                        <Box component="form" noValidate onSubmit={handleVerifyPassword}>
                            <Input
                                id="password"
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                maxLength={50}
                                value={state.values.password}
                                disabled={state.loading}
                                error={!!state.errors.password}
                                errorText={state.errors.password}
                                onChange={handleChange}
                                tabIndex={1}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={passwordVisibility} edge="end">
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Input
                                id="confirmPassword"
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                maxLength={50}
                                value={state.values.confirmPassword}
                                disabled={state.loading}
                                error={!!state.errors.confirmPassword}
                                errorText={state.errors.confirmPassword}
                                onChange={handleChange}
                                tabIndex={2}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={confirmPasswordVisibility} edge="end">
                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <AppButton
                                id="button"
                                type="submit"
                                label="Submit"
                                onClick={handleVerifyPassword}
                                loading={state.loading}
                                disabled={state.loading}
                                tabIndex={3}
                            />
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default VerifyPassword;
