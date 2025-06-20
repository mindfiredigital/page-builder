import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Checkbox, CssBaseline, FormControlLabel, Grid, Link, Paper, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LOGIN, ROUTE, ROLE, URL, LOCAL_STORAGE } from "../../utils/constant";
import { login } from "../../services/services";
import { createHandleChange, validateField } from "../../utils/validation";
import { FormDataProps, DynamicFormData } from "../../types/types";
import Copyright from "../../components/Copyright";
import Image from "../../components/Image";
import Input from "../../components/Input";
import AppButton from "../../components/Button";

const defaultTheme = createTheme();

const initialState: FormDataProps<DynamicFormData> = {
    values: { username: "", password: "" },
    errors: { username: "", password: "" },
    loading: false,
};

const Login = () => {
    const [state, setState] = useState<FormDataProps<DynamicFormData>>(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const handleChange = createHandleChange<DynamicFormData>(setState);
    const passwordVisibility = () => setShowPassword(prev => !prev);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = {
            username: validateField("emailOrUsername", state.values.username),
            password: validateField("password", state.values.password),
        };

        if (Object.values(errors).some(error => error)) {
            setState(prev => ({ ...prev, errors }));
            return;
        }

        const payload = {
            username: state.values.username,
            password: state.values.password,
            checkbox: rememberMe,
        };

        setState(prev => ({ ...prev, loading: true }));

        const response = await login(payload);
        if (response?.success) {
            window.localStorage.setItem(LOCAL_STORAGE.SESSION_TOKEN, response.data.session_token);
            window.localStorage.setItem(LOCAL_STORAGE.DISPLAY_NAME, response.data.display_name);
            window.localStorage.setItem(LOCAL_STORAGE.ROLE_ID, response.data.role_id);
            window.localStorage.setItem(LOCAL_STORAGE.USER_ID, response.data.user_id);

            if (response.data.role_id === ROLE.ADMIN || response.data.role_id === ROLE.ACCOUNT) {
                navigate(ROUTE.APPRAISAL);
            } else {
                navigate(ROUTE.TASK_CHECK);
            };
        };

        setState(prev => ({ ...prev, loading: false }));
    };

    useEffect(() => {
        const token = localStorage.getItem(LOCAL_STORAGE.SESSION_TOKEN) || sessionStorage.getItem(LOCAL_STORAGE.SESSION_TOKEN);
        if (token) {
            navigate(ROUTE.APPRAISAL);
        }
    }, [navigate]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
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
                            imageUrl={URL.MINDFIRE_LOGO_LINK}
                            sx={{
                                width: { xs: 60, sm: 120, md: 150 },
                                height: { xs: 40, sm: 80, md: 100 },
                            }}
                        />

                        <Box sx={{ margin: true ? `${16}px 0` : `0 ${12}px` }} />

                        <Box component="form" noValidate onSubmit={handleLogin}>
                            <Input
                                id="username"
                                label="Username or Email"
                                name="username"
                                type="text"
                                maxLength={50}
                                value={state.values.username}
                                disabled={state.loading}
                                error={!!state.errors.username}
                                errorText={state.errors.username}
                                onChange={handleChange}
                                tabIndex={1}
                            />

                            <Input
                                id="passwordFormField"
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                maxLength={18}
                                value={state.values.password}
                                error={!!state.errors.password}
                                errorText={state.errors.password}
                                disabled={state.loading}
                                onChange={handleChange}
                                tabIndex={2}
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

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={handleCheckboxChange}
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            />

                            <AppButton
                                id="button"
                                type="submit"
                                label="Sign In"
                                onClick={handleLogin}
                                loading={state.loading}
                                disabled={state.loading}
                                tabIndex={3}
                            />

                            <Grid container>
                                <Grid item xs>
                                    <Link href={ROUTE.FORGOT_PASSWORD}>
                                        {LOGIN.FORGOT_PASSWORD}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default Login;
