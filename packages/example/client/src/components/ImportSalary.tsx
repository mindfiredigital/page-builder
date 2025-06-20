import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, FormHelperText, Grid, Button, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { COMMON } from "../utils/constant";
import { ImportSalaryProps, ImportSalaryStateProps } from "../types/types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import AppButton from "./Button";

const initialStage = {
    selectedReason: "",
    selectedFile: null,
    fileName: "",
    importOption: "remove",
    selectedDate: null,
    error: { file: "", reason: "", date: "" },
    loading: false
};

const ImportSalary: React.FC<ImportSalaryProps> = ({ open, onClose, onSave, reasons }) => {
    const { id } = useParams();
    const [state, setState] = useState<ImportSalaryStateProps>(initialStage);

    const handleClose = () => {
        setState(initialStage);
        onClose();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setState((prev) => ({
                ...prev,
                selectedFile,
                fileName: selectedFile.name,
                error: { ...prev.error, file: "" }
            }));
        }
    };

    const handleSave = () => {
        let hasError = false;
        const newErrors = { file: "", reason: "", date: "" };

        // File validation
        if (!state.selectedFile) {
            newErrors.file = "File is required.";
            hasError = true;
        };

        // Reason validation
        if (!state.selectedReason) {
            newErrors.reason = "Reason is required";
            hasError = true;
        };

        // Date validation
        if (!state.selectedDate || state.selectedDate.isAfter(dayjs())) {
            newErrors.date = "Please select a valid past date.";
            hasError = true;
        };

        if (hasError) {
            setState((prev) => ({ ...prev, error: newErrors }));
            return;
        };

        const requestData = {
            appraisal_id: Number(id),
            reason: state.selectedReason,
            import_option: state.importOption === "update",
            date: state.selectedDate,
            file: state.selectedFile as File
        };

        onSave(requestData);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { margin: "8px", minWidth: "400px" } }}>
            <DialogTitle>Import Salary Data</DialogTitle>

            <DialogContent sx={{ px: 2 }}>
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <Button variant="outlined" component="label">
                            Choose File
                            <input type="file" hidden accept=".csv" onChange={handleFileChange} />
                        </Button>
                        <span style={{ marginLeft: 8 }}>{state.fileName}</span>
                        {state.error.file && <FormHelperText error>{state.error.file}</FormHelperText>}
                    </Grid>

                    <Grid item xs={12}>
                        <RadioGroup
                            value={state.importOption}
                            onChange={(e) => setState((prev) => ({ ...prev, importOption: e.target.value }))}
                            row
                        >
                            <FormControlLabel value="remove" control={<Radio />} label="Remove all data and import" />
                            <FormControlLabel value="update" control={<Radio />} label="Update data based on code" />
                        </RadioGroup>
                    </Grid>

                    {/* Eligibility Date Picker */}
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Eligibility Before"
                                format="DD/MM/YYYY"
                                value={state.selectedDate}
                                onChange={(newValue) => setState((prev) => ({ ...prev, selectedDate: newValue, error: { ...prev.error, date: "" } }))}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!state.error.date,
                                        helperText: state.error.date
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    {/* Ineligibility Reason Dropdown */}
                    <Grid item xs={12}>
                        <FormControl fullWidth error={!!state.error.reason}>
                            {/* <InputLabel>Ineligibility Reason</InputLabel> */}
                            <InputLabel sx={{ top: 1 }}>Ineligibility Reason</InputLabel>
                            <Select
                                labelId="reason-select-label"
                                label="Ineligibility Reason"
                                value={state.selectedReason}
                                variant="outlined"
                                onChange={(e) => setState((prev) => ({ ...prev, selectedReason: e.target.value, error: { ...prev.error, reason: "" } }))}
                            >
                                {reasons.length > 0 ? (
                                    reasons.map((reason) => (
                                        <MenuItem key={reason.id} value={reason.id}>
                                            {reason.title}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No reasons available</MenuItem>
                                )}
                            </Select>
                            {state.error.reason && <FormHelperText>{state.error.reason}</FormHelperText>}
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: "24px", py: 1 }}>
                <AppButton
                    id="cancel-button"
                    label={COMMON.CANCEL}
                    onClick={handleClose}
                    variant="text"
                    type="button"
                />
                <AppButton
                    id="save"
                    label={COMMON.IMPORT}
                    onClick={handleSave}
                    loading={state.loading}
                    disabled={state.loading}
                    textColor="primary"
                    type="submit"
                />
            </DialogActions>
        </Dialog>
    );
};

export default ImportSalary;
