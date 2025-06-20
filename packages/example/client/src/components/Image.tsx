import { Box } from "@mui/material";
import { ImageProps } from "../types/types";

const Image: React.FC<ImageProps> = ({ imageUrl = "", imagePath = "", sx, className, style }) => {
    const url = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
    return (
        <Box
            component="img"
            src={url ? imageUrl : imagePath}
            sx={sx}
            className={className}
            style={style}
        />
    );
};

export default Image;
