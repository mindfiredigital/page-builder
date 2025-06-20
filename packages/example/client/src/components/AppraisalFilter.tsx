import {
    Box,
    Grid,
    Modal,
    FormControl,
    DialogActions,
    DialogContent,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Checkbox,
    Switch,
    Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AppraisalFiltersProps, AppraisalFiltersStateProps } from "../types/types";
import { APPRAISAL_TABLE_TYPE, COMMON, LOCAL_STORAGE, ROLE } from "../utils/constant";
import AppButton from "./Button";
import dayjs from "dayjs";

const initialStage = {
    doj_from: "",
    doj_to: "",
    experience_from: "",
    experience_to: "",
    leads: [],
    eligible: "",
    error: { doj_from: "", doj_to: "", experience_from: "", experience_to: "" },
    loading: false
};

const AppraisalFilter: React.FC<AppraisalFiltersProps> = ({ open, onClose, onSave, lead }) => {
    const [state, setState] = useState<AppraisalFiltersStateProps>(initialStage);
    const role = localStorage.getItem(LOCAL_STORAGE.ROLE_ID);
    const admin = Number(role) === ROLE.ADMIN;
    const manager = Number(role) === ROLE.MANAGER;
    const table = localStorage.getItem(LOCAL_STORAGE.ACTIVE_TABLE);

    useEffect(() => {
        if (open) {
            setState((prev) => ({
                ...prev,
            }));
        }
    }, [open]);

    const handleClose = () => {
        setState(initialStage);
        onClose();
        onSave({});
    };

    const handleSave = () => {
        let hasError = false;
        const errors = { doj_from: "", doj_to: "", experience_from: "", experience_to: "" };

        if (state.doj_from && !state.doj_to) {
            errors.doj_to = "DOJ To is required if DOJ From is selected";
            hasError = true;
        } else if (!state.doj_from && state.doj_to) {
            errors.doj_from = "DOJ From is required if DOJ To is selected";
            hasError = true;
        } else if (state.doj_from && state.doj_to && dayjs(state.doj_from).isAfter(dayjs(state.doj_to))) {
            errors.doj_to = "DOJ To should be after DOJ From";
            hasError = true;
        }

        if (state.experience_to && !state.experience_from) {
            errors.experience_from = "Experience From is required if Experience To is selected";
            hasError = true;
        } else if (!state.experience_to && state.experience_from) {
            errors.experience_to = "Experience To is required if Experience From is selected";
            hasError = true;
        } else if (
            state.experience_from &&
            state.experience_to &&
            Number(state.experience_from) > Number(state.experience_to)
        ) {
            errors.experience_to = "Experience To should be greater than or equal to Experience From";
            hasError = true;
        }

        if (hasError) {
            setState((prev) => ({ ...prev, error: errors }));
            return;
        }

        const requestData = {
            doj_from: state.doj_from,
            doj_to: state.doj_to,
            experience_from: Number(state.experience_from),
            experience_to: Number(state.experience_to),
            leads: state.leads,
            eligible: state.eligible
        };

        onSave(requestData);
        onClose();
    };

    const handleDateChange = (newValue: any, fieldName: string) => {
        const formattedDate = newValue ? newValue.format("YYYY-MM-DDT00:00:00.000") : "";

        setState((prev) => ({
            ...prev,
            [fieldName]: formattedDate,
            error: { ...prev.error, [fieldName]: "" },
        }));
    };

    return (
        <Modal open={open} onClose={() => onClose()} aria-labelledby="filter-modal-title">
            <Box sx={{ p: 3, bgcolor: "white", maxWidth: 600, mx: "auto", mt: 10, borderRadius: 2 }}>
                <DialogContent sx={{ paddingTop: "10px !important" }}>
                    <Grid container spacing={2}>
                        {(admin || manager) &&
                            <Grid item xs={12}>
                                <FormControl disabled={state.loading} fullWidth>
                                    <InputLabel>Leads</InputLabel>
                                    <Select
                                        labelId="leads"
                                        label="Leads"
                                        variant="outlined"
                                        multiple
                                        value={state.leads}
                                        onChange={(event) => {
                                            setState(prev => ({
                                                ...prev,
                                                leads: event.target.value as string[],
                                            }));
                                        }}
                                        renderValue={(selected) => {
                                            if (selected.length === 0) {
                                                return null;
                                            }
                                            if (selected.length === 1) {
                                                return lead.find((l) => l.code === selected[0])?.name || selected[0];
                                            }
                                            return `${lead.find((l) => l.code === selected[0])?.name || selected[0]} +${selected.length - 1}`;
                                        }}
                                    >
                                        {lead.length > 0 ? (
                                            lead.map((lead) => (
                                                <MenuItem key={lead.code} value={lead.code}>
                                                    <Checkbox checked={state.leads.includes(lead.code)} />
                                                    {lead.name} ({lead.code})
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No leads available</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        }

                        <Grid item xs={6}>
                            <TextField
                                label="Experience (From) In years"
                                type="number"
                                fullWidth
                                value={state.experience_from}
                                onChange={(event) =>
                                    setState((prev) => ({
                                        ...prev,
                                        experience_from: event.target.value,
                                        error: { ...prev.error, experience_from: "" }
                                    }))
                                }
                                error={!!state.error.experience_from}
                                helperText={state.error.experience_from}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Experience (To) In years"
                                type="number"
                                fullWidth
                                value={state.experience_to}
                                onChange={(event) =>
                                    setState((prev) => ({
                                        ...prev,
                                        experience_to: event.target.value,
                                        error: { ...prev.error, experience_to: "" }
                                    }))
                                }
                                error={!!state.error.experience_to}
                                helperText={state.error.experience_to}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    label="Date of Joining (From)"
                                    format="DD/MM/YYYY"
                                    value={dayjs(state.doj_from)}
                                    onChange={(newValue) => handleDateChange(newValue, "doj_from")}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!state.error.doj_from,
                                            helperText: state.error.doj_from,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    label="Date of Joining (To)"
                                    value={dayjs(state.doj_to)}
                                    format="DD/MM/YYYY"
                                    onChange={(newValue) => handleDateChange(newValue, "doj_to")}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!state.error.doj_to,
                                            helperText: state.error.doj_to,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                    {table !== String(APPRAISAL_TABLE_TYPE.REVISION) &&
                        <Box display="flex" alignItems="center" mt={2} mb={2}>
                            <Switch
                                checked={state.eligible === "1"}
                                onChange={(event) =>
                                    setState((prev) => ({
                                        ...prev,
                                        eligible: event.target.checked ? "1" : "0",
                                    }))
                                }
                            />
                            <Typography variant="body1" ml={1}>Show Eligible</Typography>
                        </Box>
                    }
                </DialogContent>

                <DialogActions sx={{ px: "24px", py: 1 }}>
                    <AppButton
                        id="reset-button"
                        label={COMMON.RESET}
                        onClick={handleClose}
                        variant="text"
                        type="button"
                        tabIndex={1}
                    />
                    <AppButton
                        id="filter-button"
                        label={COMMON.FILTER}
                        onClick={handleSave}
                        textColor="secondary"
                        type="button"
                        tabIndex={2}
                    />
                </DialogActions>
            </Box>
        </Modal>
    );
};

export default AppraisalFilter;
