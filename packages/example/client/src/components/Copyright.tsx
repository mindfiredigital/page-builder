import { Link, Typography } from "@mui/material";
import { COPYRIGHT_MENU, LOGIN, URL } from "../utils/constant";

const Copyright = ({ ...props }) => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {COPYRIGHT_MENU.COPYRIGHT}
            <Link color="inherit" href={URL.MINDFIRE_SOLUTIONS_URL} target="_blank">
                {LOGIN.MINDFIRE_SOLUTIONS}
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
};

export default Copyright;
