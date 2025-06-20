import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, FormHelperText } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ImportSelectionProps } from "../types/types";
import { appraisalList } from "../services/services";
import { COMMON } from "../utils/constant";
import AppButton from "./Button";

const ImportSelection: React.FC<ImportSelectionProps> = ({ open, onClose, onSave }) => {
    const [state, setState] = useState({
        appraisals: [],
        loading: false,
        selectedAppraisal: "",
        error: ""
    });
    const { id } = useParams();

    const fetchData = useCallback(async () => {
        if (!id) return;

        setState(prev => ({ ...prev, loading: true }));

        const response = await appraisalList(1, 500, "", []);
        if (response?.success) {

            const appraisals = response.data.appraisals.filter(
                (appraisal: any) => appraisal.id !== Number(id)
            );

            setState(prev => ({
                ...prev,
                appraisals: appraisals,
                loading: false
            }));
        } else {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [id]);

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open, fetchData]);

    const handleAppraisalChange = (event: any) => {
        setState(prev => ({
            ...prev,
            selectedAppraisal: event.target.value,
            error: ""
        }));
    };

    const handleClose = () => {
        setState({ appraisals: [], loading: false, error: "", selectedAppraisal: "" });
        onClose();
    };

    const handleSave = () => {
        if (!state.selectedAppraisal) {
            setState(prev => ({ ...prev, error: "Appraisal is required" }));
            return;
        }
        onSave(Number(state.selectedAppraisal));
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { margin: "8px", minWidth: "300px" } }}>
            <DialogTitle>Import from Appraisal</DialogTitle>
            <DialogContent sx={{ px: 2 }}>

                <FormControl fullWidth disabled={state.loading} error={!!state.error}>
                    <InputLabel sx={{ marginTop: 2 }}>Appraisal</InputLabel>
                    <Select
                        labelId="appraisal-select-label"
                        value={state?.selectedAppraisal}
                        label="Appraisal"
                        variant="outlined"
                        onChange={handleAppraisalChange}
                        sx={{ marginTop: 2 }}
                    >
                        {state?.appraisals?.map((appraisal: any) => (
                            <MenuItem key={appraisal.id} value={appraisal.id}>
                                {appraisal.title}
                            </MenuItem>
                        ))}
                    </Select>
                    {state.error && <FormHelperText>{state.error}</FormHelperText>}
                </FormControl>

            </DialogContent>

            <DialogActions sx={{ px: "24px", py: 1 }}>
                <AppButton
                    id="cancel-button"
                    label={COMMON.CANCEL}
                    onClick={handleClose}
                    variant="text"
                    type="button"
                    tabIndex={2}
                />
                <AppButton
                    id="save"
                    label={COMMON.ADD}
                    onClick={handleSave}
                    textColor="primary"
                    type="submit"
                    loading={state.loading}
                    disabled={state.loading}
                    tabIndex={3}
                />
            </DialogActions>
        </Dialog>
    );
};

export default ImportSelection;
