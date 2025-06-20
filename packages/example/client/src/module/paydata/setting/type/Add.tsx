import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, FormHelperText, MenuItem, SelectChangeEvent } from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AddPaydataTypeProps, FormDataProps, DynamicFormData } from "../../../../types/types";
import { paydataTypeCreate, paydataTypeUpdate } from "../../../../services/services";
import { PAYDATA_TYPE, COMMON } from "../../../../utils/constant";
import { createHandleChange, validateField } from "../../../../utils/validation";
import AppButton from "../../../../components/Button";
import Input from "../../../../components/Input";

const initialState: FormDataProps<DynamicFormData> = {
    values: { parent: "", title: "", payment_type: "", is_recurring: "" },
    errors: { title: "", payment_type: "", is_recurring: "" },
    loading: false
};

const Add = ({ open, onClose, data, parentOptions }: AddPaydataTypeProps) => {
    const [state, setState] = useState<FormDataProps<DynamicFormData>>(initialState);
    const handleChange = createHandleChange(setState);

    useEffect(() => {
        if (open) {
            if (data) {
                setState({
                    values: {
                        title: data.title,
                        parent: data.parent_title,
                        payment_type: data.payment_type,
                        is_recurring: data.is_recurring
                    },
                    errors: { title: "", payment_type: "", is_recurring: "" },
                    loading: false
                });
            } else {
                setState(initialState);
            }
        }
    }, [data, open, parentOptions]);

    const handleClose = () => {
        onClose(false);
        setState(initialState);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = {
            title: validateField("title", state.values.title),
            payment_type: validateField("payment_type", state.values.payment_type),
            is_recurring: validateField("is_recurring", state.values.is_recurring)
        };

        if (Object.values(errors).some(error => error)) {
            setState(prev => ({ ...prev, errors }));
            return;
        }

        setState(prev => ({ ...prev, loading: true }));

        const payload = {
            parent: parentOptions?.find(item => item.title === state.values.parent)?.id || "None",
            title: state.values.title,
            payment_type: state.values.payment_type,
            is_recurring: state.values.is_recurring
        };

        let response;
        if (data) {
            response = await paydataTypeUpdate(data.id, payload);
        } else {
            response = await paydataTypeCreate(payload);
        }

        if (response?.success) {
            toast.success(response.message);
            setState(initialState);
            onClose(true);
        }
        setState(prev => ({ ...prev, loading: false }));
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="xs">

            <DialogTitle>
                {data ? PAYDATA_TYPE.EDIT : PAYDATA_TYPE.CREATE}
            </DialogTitle>

            <DialogContent sx={{ paddingTop: "10px !important" }}>

                <FormControl fullWidth disabled={state.loading} sx={{ mb: 2 }}>
                    <InputLabel>Parent</InputLabel>
                    <Select
                        label="Parent"
                        value={state.values.parent}
                        onChange={(e: SelectChangeEvent<string>) =>
                            setState(prev => ({
                                ...prev,
                                values: { ...prev.values, parent: e.target.value }
                            }))
                        }
                    >
                        <MenuItem value="None">None</MenuItem>
                        {parentOptions?.filter(item => item.id !== data?.id).map(item => (
                            <MenuItem key={item.id} value={item.title}>
                                {item.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Input
                    id="title"
                    label={PAYDATA_TYPE.TITLE}
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

                <FormControl fullWidth disabled={state.loading} error={!!state.errors.payment_type} sx={{ mb: 2 }}>
                    <InputLabel>Payment Type</InputLabel>
                    <Select
                        label="Payment Type"
                        value={state.values.payment_type}
                        onChange={(e: SelectChangeEvent<string>) =>
                            setState(prev => ({
                                ...prev,
                                values: { ...prev.values, payment_type: e.target.value },
                                errors: { ...prev.errors, payment_type: "" }
                            }))
                        }
                    >
                        <MenuItem value="Credit">Credit</MenuItem>
                        <MenuItem value="Debit">Debit</MenuItem>
                    </Select>
                    {state.errors.payment_type && <FormHelperText>{state.errors.payment_type}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth disabled={state.loading} error={!!state.errors.is_recurring} sx={{ mb: 2 }}>
                    <InputLabel>Recurring</InputLabel>
                    <Select
                        label="Recurring"
                        value={state.values.is_recurring}
                        onChange={(e: SelectChangeEvent<string>) =>
                            setState(prev => ({
                                ...prev,
                                values: { ...prev.values, is_recurring: e.target.value },
                                errors: { ...prev.errors, is_recurring: "" }
                            }))
                        }
                    >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                    {state.errors.is_recurring && <FormHelperText>{state.errors.is_recurring}</FormHelperText>}
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
                    label={data ? COMMON.SAVE_CHANGE : COMMON.CREATE}
                    onClick={handleSave}
                    textColor="primary"
                    type="submit"
                    loading={state.loading}
                    disabled={state.loading}
                    tabIndex={3} />
            </DialogActions>
        </Dialog>
    );
};

export default Add;
