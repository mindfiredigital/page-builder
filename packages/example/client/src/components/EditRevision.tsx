import { Backdrop, CircularProgress, DialogContent, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { EditRevisionProps } from "../types/types";
import { COMMON, REGEX } from "../utils/constant";
import AppButton from "../components/Button";
import Input from "../components/Input";

const EditRevision: React.FC<EditRevisionProps> = ({
    open,
    id,
    note,
    raise_amount,
    name,
    onClose,
    onSave,
    loading,
}) => {
    const raiseAmountRef = useRef<HTMLInputElement | null>(null);

    const [state, setState] = useState({
        values: {
            raise_amount: "",
            note: "",
        },
        errors: {
            raise_amount: "",
            note: "",
        },
    });

    useEffect(() => {
        if (open) {
            setState((prev) => ({
                ...prev,
                values: {
                    raise_amount: String(raise_amount),
                    note: note || "",
                },
                errors: {
                    raise_amount: "",
                    note: "",
                },
            }));
        } else {
            setState((prev) => ({
                ...prev,
                errors: {
                    raise_amount: "",
                    note: "",
                },
            }));
        }
    }, [open, raise_amount, note]);

    const validateRaiseAmount = (value: string) => {
        if (!value) {
            return "Raise Amount is required.";
        }
        if (!REGEX.VALID_NUMBER.test(value)) {
            return "Enter a valid number.";
        }
        return "";
    };

    const handleRaiseAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const error = validateRaiseAmount(value);

        setState((prev) => ({
            ...prev,
            values: {
                ...prev.values,
                raise_amount: value,
            },
            errors: {
                ...prev.errors,
                raise_amount: error,
            },
        }));
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState((prev) => ({
            ...prev,
            values: {
                ...prev.values,
                note: e.target.value,
            },
            errors: {
                ...prev.errors,
                note: "",
            },
        }));
    };

    const handleSave = (publish: boolean) => () => {
        const raiseAmountError = validateRaiseAmount(state.values.raise_amount);

        if (raiseAmountError) {
            setState((prev) => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    raise_amount: raiseAmountError,
                },
            }));
            return;
        }

        onSave({
            id,
            raise_amount: state.values.raise_amount,
            note: state.values.note,
            ...(publish ? { publish: true } : {}),
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            TransitionProps={{
                onEntered: () => {
                    if (raiseAmountRef.current) {
                        raiseAmountRef.current.focus();
                    }
                },
            }}
        >
            <Backdrop
                open={loading}
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <DialogTitle>Edit Revision: {name}</DialogTitle>

            <DialogContent style={{ paddingTop: "16px" }}>
                <Input
                    id="raise-amount"
                    label="Raise Amount"
                    name="raise_amount"
                    type="text"
                    maxLength={10}
                    value={state.values.raise_amount}
                    disabled={loading}
                    error={!!state.errors.raise_amount}
                    errorText={state.errors.raise_amount}
                    tabIndex={1}
                    onChange={handleRaiseAmountChange}
                    inputRef={raiseAmountRef}
                />

                <Input
                    required={false}
                    id="note"
                    label="Note"
                    name="note"
                    type="text"
                    maxLength={500}
                    value={state.values.note}
                    disabled={loading}
                    error={!!state.errors.note}
                    errorText={state.errors.note}
                    tabIndex={2}
                    onChange={handleNoteChange}
                    multiline
                    rows={4}
                />
            </DialogContent>

            <DialogActions>
                <AppButton
                    id="cancel-button"
                    label={COMMON.CANCEL}
                    onClick={onClose}
                    variant="text"
                    type="button"
                    tabIndex={3}
                />
                <AppButton
                    id="save-button"
                    label={COMMON.SAVE}
                    onClick={handleSave(false)}
                    textColor="primary"
                    type="submit"
                    disabled={loading}
                    tabIndex={4}
                />
                <AppButton
                    id="save-publish-button"
                    label={COMMON.SAVE_PUBLISH}
                    onClick={handleSave(true)}
                    textColor="primary"
                    disabled={loading}
                    type="submit"
                    tabIndex={5}
                />
            </DialogActions>
        </Dialog>
    );
};

export default EditRevision;
