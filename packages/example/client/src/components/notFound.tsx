import { Box, Button, Typography } from "@mui/material";
import { ROUTE } from "../utils/constant";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(ROUTE.LOGIN);
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            flexDirection="column"
            textAlign="center"
        >
            <Typography variant="h4" gutterBottom>
                404 - Page Not Found
            </Typography>
            <Typography variant="body1" paragraph>
                Sorry, the page you are looking for does not exist. Please check the URL or click the button below to return to the login page.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleRedirect}>
                Go to Home
            </Button>
        </Box>
    );
};

export default NotFound;
