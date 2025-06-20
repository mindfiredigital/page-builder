import { Box } from "@mui/material";
import { StageEllipseProps } from "../types/types";

const getStyles = (stage: string) => {
    switch (stage) {
        case "Open":
            return { background: "#15803d", hoverBackground: "#15803dCC", color: "#ffffff" };
        case "Archived":
            return { background: "#b91c1c", hoverBackground: "#b91c1cCC", color: "#ffffff" };
        case "Closed":
            return { background: "#7b1fa2", hoverBackground: "#7b1fa2CC", color: "#ffffff" };
        case "Draft":
            return { background: "#ffa000", hoverBackground: "#ffa000CC", color: "#ffffff" };
        default:
            return { background: "#cccccc", hoverBackground: "#cccccc", color: "#000000" };
    }
};

const StageEllipse: React.FC<StageEllipseProps> = ({ stage }) => {
    const styles = getStyles(stage);

    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50px",
                padding: "5px 15px",
                fontSize: "14px",
                fontWeight: 600,
                background: styles.background,
                color: styles.color,
                "&:hover": {
                    background: styles.hoverBackground,
                },
            }}
        >
            {stage}
        </Box>
    );
};

export default StageEllipse;
