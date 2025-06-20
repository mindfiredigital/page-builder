import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { AddAppraisalReasonProps, FormDataProps, DynamicFormData } from "../../../../types/types";
import { appraisalReasonCreate, appraisalReasonUpdate } from "../../../../services/services";
import { APPRAISAL_REASON, COMMON } from "../../../../utils/constant";
import { createHandleChange, validateField } from "../../../../utils/validation";
import AppButton from "../../../../components/Button";
import Input from "../../../../components/Input";

const initialState: FormDataProps<DynamicFormData> = {
    values: { title: "" },
    errors: { title: "" },
    loading: false
};

const Add = ({ open, onClose, data }: AddAppraisalReasonProps) => {
    const [state, setState] = useState<FormDataProps<DynamicFormData>>(initialState);
    const handleChange = createHandleChange(setState);
    const { id } = useParams();

    useEffect(() => {
        if (open) {
            if (data) {
                setState({
                    values: { title: data?.title ?? "" },
                    errors: { title: "" },
                    loading: false
                });
            } else {
                setState(initialState);
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
            title: validateField("title", state.values.title)
        };

        if (Object.values(errors).some(error => error)) {
            setState(prev => ({ ...prev, errors }));
            return;
        }

        setState(prev => ({ ...prev, loading: true }));

        const response = data
            ? await appraisalReasonUpdate(Number(data.id), { title: state.values.title })
            : await appraisalReasonCreate({ appraisal_id: Number(id), title: state.values.title });

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
                {data ? APPRAISAL_REASON.EDIT : APPRAISAL_REASON.CREATE}
            </DialogTitle>

            <DialogContent sx={{ paddingTop: "10px !important" }}>

                <Input
                    id="title"
                    label={APPRAISAL_REASON.TITLE}
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
