import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Switch,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from "@mui/material";
import { AppraisalReasonProps, EditAppraisalPeopleProps, EditAppraisalPeopleStateProps } from "../types/types";
import { COMMON, REGEX } from "../utils/constant";
import AppButton from "./Button";
import Input from "../components/Input";

const initialStage: EditAppraisalPeopleStateProps = {
    selectedReason: "",
    basic: "",
    hra: "",
    other_allowances: "",
    provident_fund: "",
    errors: { selectedReason: "", basic: "", hra: "", other_allowances: "", provident_fund: "" },
};

const EditAppraisalPeople: React.FC<EditAppraisalPeopleProps> = ({
    open,
    currentValue,
    onClose,
    onSave,
    toggleValue,
    reason,
    peopleData,
    loading
}) => {
    const [state, setState] = useState(initialStage);

    useEffect(() => {
        if (open && peopleData) {
            setState({
                selectedReason: peopleData.ineligibility_reason_id,
                basic: peopleData.basic,
                hra: peopleData.hra,
                other_allowances: peopleData.other_allowances,
                provident_fund: peopleData.provident_fund,
                errors: { selectedReason: "", basic: "", hra: "", other_allowances: "", provident_fund: "" }
            });
        } else if (!open) {
            setState(initialStage);
        }
    }, [open, peopleData]);

    const validateField = (name: string, value: string) => {
        if (value === null || value === undefined || value === "") {
            return `${name.replace("_", " ")} is required.`;
        }
        if (!REGEX.VALID_NUMBER.test(value)) {
            return `Enter a valid number for ${name.replace("_", " ")}.`;
        }
        return "";
    };

    const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = e.target;

        if (!name) return;

        setState((prev) => ({
            ...prev,
            [name]: value,
            errors: {
                ...prev.errors,
                [name]: validateField(name, value as string),
            },
        }));
    };

    const handleSave = () => {
        let errors: Record<string, string> = {};

        if (!currentValue && !state.selectedReason) {
            errors.selectedReason = "Reason is required when ineligible";
        }

        if (peopleData?.show_yellow) {
            ["basic", "hra", "other_allowances", "provident_fund"].forEach((field) => {
                const error = validateField(field, state[field as keyof typeof state] as string);
                if (error) {
                    errors[field] = error;
                }
            });
        }

        if (Object.keys(errors).length > 0) {
            setState((prev) => ({ ...prev, errors }));
            return;
        }

        const savePayload: any = {
            eligible: currentValue,
            reason: state.selectedReason
        };

        if (peopleData?.show_yellow) {
            savePayload.basic = Number(state.basic);
            savePayload.hra = Number(state.hra);
            savePayload.other_allowances = Number(state.other_allowances);
            savePayload.provident_fund = Number(state.provident_fund);
        }

        onSave(savePayload);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{peopleData?.show_yellow ? "Update Appraisal" : "Change Eligibility"}</DialogTitle>

            <DialogContent>
                <Typography>
                    {peopleData?.show_yellow
                        ? "Update the appraisal details for the selected user."
                        : "Change user eligibility for the current appraisal"}
                </Typography>

                <Box display="flex" alignItems="center" mt={2} mb={2}>
                    <Switch checked={Boolean(currentValue)} onChange={toggleValue} />
                    <Typography variant="body1" ml={1}>
                        {currentValue ? "Eligible" : "Not Eligible"}
                    </Typography>
                </Box>

                {!currentValue && (
                    <Grid item xs={12}>
                        <FormControl fullWidth error={state.errors.selectedReason !== "" && !state.selectedReason}>
                            <InputLabel sx={{ top: 1, color: state.errors.selectedReason !== "" && !state.selectedReason ? "error.main" : "inherit" }}>
                                Ineligibility Reason
                            </InputLabel>
                            <Select
                                labelId="reason-select-label"
                                label="Ineligibility Reason"
                                value={state.selectedReason}
                                variant="outlined"
                                onChange={(e) => setState((prev) => ({ ...prev, selectedReason: e.target.value }))}
                                required={!currentValue}
                            >
                                {reason.length > 0 ? (
                                    reason.map((reason: AppraisalReasonProps) => (
                                        <MenuItem key={reason.id} value={reason.id}>
                                            {reason.title}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No reasons available</MenuItem>
                                )}
                            </Select>
                            {state.errors.selectedReason !== "" && !state.selectedReason && (
                                <FormHelperText error>Reason is required when ineligible</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                )}

                {peopleData?.show_yellow && (
                    <Box mt={2}>
                        {["basic", "hra", "other_allowances", "provident_fund"].map((field, index) => (
                            <Input
                                key={field}
                                id={field}
                                label={field.replace("_", " ").toUpperCase()}
                                name={field}
                                type="text"
                                maxLength={10}
                                value={(state as any)[field]}
                                disabled={loading}
                                error={!!state.errors[field]}
                                errorText={state.errors[field]}
                                tabIndex={index + 1}
                                onChange={handleChange}
                            />
                        ))}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: "24px", py: 1 }}>
                <AppButton
                    id="cancel-button"
                    label={COMMON.CANCEL}
                    onClick={onClose}
                    variant="text"
                    type="button"
                    tabIndex={2}
                />
                <AppButton
                    id="save"
                    label={COMMON.SAVE_CHANGE}
                    onClick={handleSave}
                    textColor="primary"
                    type="submit"
                    tabIndex={3}
                />
            </DialogActions>
        </Dialog>
    );
};

export default EditAppraisalPeople;
