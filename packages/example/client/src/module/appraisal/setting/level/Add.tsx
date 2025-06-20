import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormGroup, FormControlLabel, Checkbox, FormHelperText, Typography } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { AddAppraisalLevelProps, FormDataProps, DynamicFormData, RoleProps } from "../../../../types/types";
import { appraisalLevelCreate, appraisalLevelUpdate, roleList } from "../../../../services/services";
import { APPRAISAL_LEVEL, COMMON } from "../../../../utils/constant";
import { createHandleChange, validateField } from "../../../../utils/validation";
import AppButton from "../../../../components/Button";
import Input from "../../../../components/Input";

const initialState = {
    values: { title: "" },
    errors: { title: "" },
    loading: false,
};

const Add = ({ open, onClose, data }: AddAppraisalLevelProps) => {
    const [state, setState] = useState<FormDataProps<DynamicFormData>>(initialState);
    const [roles, setRoles] = useState<RoleProps[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const handleChange = createHandleChange(setState);
    const { id } = useParams();

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));
        const response = await roleList();

        if (response?.success) {
            setRoles(response?.data?.roles || []);
        }
        setState(prev => ({ ...prev, loading: false }));
    }, []);

    useEffect(() => {
        if (open) {
            if (data) {
                setState(prev => ({
                    ...prev,
                    values: { title: data?.title ?? "" },
                    errors: { title: "" },
                    loading: false
                }));
    
                const roleIds = Array.isArray(data.roles) ? data.roles.map((role: { role_id: number }) => role.role_id) : [];
                setSelectedRoles(roleIds);
            } else {
                setState(initialState);
                setSelectedRoles([]);
            }
            fetchData();
        }
    }, [data, open, fetchData]);

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const roleId = Number(event.target.value);
        setSelectedRoles(prev =>
            event.target.checked ? [...prev, roleId] : prev.filter(id => id !== roleId)
        );
    };

    const handleClose = () => {
        onClose(false);
        setState(initialState);
        setSelectedRoles([]);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = {
            title: validateField("title", state.values.title),
            role_id: selectedRoles.length === 0 ? "At least one role must be selected" : ""
        };

        if (Object.values(errors).some(error => error)) {
            setState(prev => ({ ...prev, errors }));
            return;
        }

        setState(prev => ({ ...prev, loading: true }));

        const payload = {
            appraisal_id: Number(id),
            title: state.values.title,
            role_id: selectedRoles
        };

        const response = data
            ? await appraisalLevelUpdate(Number(data.id), payload)
            : await appraisalLevelCreate(payload);

        if (response?.success) {
            toast.success(response.message);
            setState(initialState);
            setSelectedRoles([]);
            onClose(true);
        }

        setState(prev => ({ ...prev, loading: false }));
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>
                {data ? APPRAISAL_LEVEL.EDIT : APPRAISAL_LEVEL.CREATE}
            </DialogTitle>

            <DialogContent sx={{ paddingTop: "10px !important" }}>
                <Input
                    id="title"
                    label={APPRAISAL_LEVEL.TITLE}
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

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Select Roles
                </Typography>
                <FormControl fullWidth error={!!state.errors.role_id} disabled={state.loading} sx={{ mt: 2 }}>
                    <FormGroup>
                        {roles.map((r: RoleProps) => (
                            <FormControlLabel
                                key={r.id}
                                control={
                                    <Checkbox
                                        value={r.id}
                                        checked={selectedRoles.includes(r.id ?? 0)}
                                        onChange={handleRoleChange}
                                    />
                                }
                                label={r.title}
                                sx={{ alignItems: "center", paddingLeft: 1 }}
                            />
                        ))}
                    </FormGroup>
                    {state.errors.role_id && <FormHelperText>{state.errors.role_id}</FormHelperText>}
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
                    tabIndex={3}
                />
            </DialogActions>
        </Dialog>
    );
};

export default Add;
