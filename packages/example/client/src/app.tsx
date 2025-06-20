import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { ROUTE } from "./utils/constant";
import useRoutes from "./utils/route";
import Layout from "./components/Layout";
import NotFound from "./components/notFound";

const App = () => {
    const AppRoutes = useRoutes(); 

    return (
        <BrowserRouter>
            <Box>
                <Toaster />
                <Suspense fallback={<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><CircularProgress /></Box>}>
                    <Routes>
                        <Route path={ROUTE.HOME} element={<Navigate to={ROUTE.LOGIN} />} />
                        {AppRoutes.publicRoutes.map(({ path, element: Element }) => (
                            <Route key={path} path={path} element={<Element />} />
                        ))}
                        <Route element={<Layout />}>
                            {AppRoutes.privateRoutes.map(({ path, element: Element }) => (
                                <Route key={path} path={path} element={<Element />} />
                            ))}
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </Box>
        </BrowserRouter>
    );
};

export default App;