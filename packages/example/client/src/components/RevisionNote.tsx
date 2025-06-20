import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Box,
} from "@mui/material";
import { Close, Notes } from "@mui/icons-material";
import { RevisionNoteProps } from "../types/types";

const RevisionNote: React.FC<RevisionNoteProps> = ({ open, onClose, notes }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            aria-labelledby="dialog-title"
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Appraisal Revision Notes
                {onClose && (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent dividers>
                {notes.map((noteItem, index) => (
                    <Box key={index} mb={2}>
                        <Card variant="outlined">
                            <CardHeader
                                avatar={<Notes color="action" />}
                                title={
                                    <Typography variant="h6" component="div">
                                        {noteItem.name}
                                    </Typography>
                                }
                                sx={{ backgroundColor: (theme) => theme.palette.action.hover }}
                            />
                            <CardContent>
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                    style={{ whiteSpace: "pre-line" }}
                                >
                                    {noteItem.note}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </DialogContent>
        </Dialog>
    );
};

export default RevisionNote;
