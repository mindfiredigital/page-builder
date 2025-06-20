import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { DialogProps } from "../types/types"

const AppDialog: React.FC<DialogProps> = ({
    open,
    onClose,
    title,
    description,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    onConfirm,
    onCancel,
}) => {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>{cancelButtonText}</Button>
                <Button onClick={handleConfirm} autoFocus>
                    {confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AppDialog;
