import { Dialog, DialogTitle, DialogContent, DialogActions, Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AddAppraisalProps, FormDataProps, DynamicFormData } from "../../types/types";
import { appraisalCreate, appraisalUpdate } from "../../services/services";
import { APPRAISAL, COMMON } from "../../utils/constant";
import { createHandleChange, validateField } from "../../utils/validation";
import dayjs, { Dayjs } from "dayjs";
import AppButton from "../../components/Button";
import Input from "../../components/Input";

const initialState: FormDataProps<DynamicFormData> = {
    values: { title: "" },
    errors: { title: "", validate_record_date: "" },
    loading: false
};

const Add = ({ open, onClose, data }: AddAppraisalProps) => {
    const defaultDate = dayjs().set("month", 2).set("date", 1);
    const [state, setState] = useState<FormDataProps<DynamicFormData>>(initialState);
    const [validateRecord, setValidateRecord] = useState<Dayjs | null>(defaultDate);
    const handleChange = createHandleChange(setState);

    useEffect(() => {
        if (open) {
            if (data && data.title) {
                setState({
                    values: { title: data.title },
                    errors: { title: "", validate_record_date: "" },
                    loading: false
                });
                setValidateRecord(data.validate_record_date ? dayjs(data.validate_record_date) : defaultDate);
            } else {
                setState(initialState);
                setValidateRecord(defaultDate);
            }
        }
    }, [data, open]);

    const handleClose = () => {
        onClose(false);
        setState(initialState);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = {
            title: validateField("title", state.values.title),
            validate_record_date: validateField("validate_record_date", String(validateRecord))
        };

        if (Object.values(errors).some(error => error)) {
            setState(prev => ({ ...prev, errors }));
            return;
        };

        setState(prev => ({ ...prev, loading: true }));

        let response;
        if (data) {
            response = await appraisalUpdate(data.id, { title: state.values.title, validate_record_date: validateRecord });
        } else {
            response = await appraisalCreate({ title: state.values.title, validate_record_date: validateRecord });
        };

        if (response?.success) {
            toast.success(response.message);
            setState(initialState);
            onClose(true);
        };
        setState(prev => ({ ...prev, loading: false }));
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="xs">
            <DialogTitle>
                {data ? APPRAISAL.EDIT : APPRAISAL.CREATE}
            </DialogTitle>
            <DialogContent sx={{ paddingTop: "10px !important" }}>
                <Input
                    id="title"
                    label={APPRAISAL.TITLE}
                    name="title"
                    type="text"
                    maxLength={50}
                    value={state.values.title}
                    disabled={state.loading}
                    error={!!state.errors.title}
                    errorText={state.errors.title}
                    onChange={handleChange}
                    tabIndex={1}
                />

                <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Validate Record on/after"
                            value={validateRecord}
                            format="DD/MM/YYYY"
                            onChange={(newValue) => {
                                setValidateRecord(newValue);
                                setState((prev) => ({
                                    ...prev,
                                    values: { ...prev.values },
                                    errors: { ...prev.errors, validate_record_date: "" }
                                }));
                            }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: !!state.errors.validate_record_date,
                                    helperText: state.errors.validate_record_date
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
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
                    label={data && data.title ? COMMON.SAVE_CHANGE : COMMON.CREATE}
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

export default Add;