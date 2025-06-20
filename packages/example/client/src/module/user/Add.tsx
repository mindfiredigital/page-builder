import {
    Dialog, DialogTitle, DialogContent, DialogActions, FormHelperText,
    FormControl, InputLabel, Select, SelectChangeEvent, MenuItem,
    FormGroup, FormControlLabel, Checkbox, Typography, Grid, Box
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { AddUserProps, FormDataProps, DynamicFormData } from "../../types/types";
import { userCreate, userUpdate, roleList } from "../../services/services";
import { COMMON, ROLE, USER, PERMISSIONS } from "../../utils/constant";
import { createHandleChange, validateField } from "../../utils/validation";
import AppButton from "../../components/Button";
import Input from "../../components/Input";

const initialState: FormDataProps<DynamicFormData> = {
    values: { name: "", username: "", role_id: "", email: "" },
    errors: { name: "", username: "", role_id: "", email: "" },
    loading: false
};

const Add = ({ open, onClose, data }: AddUserProps) => {
    const [roles, setRoles] = useState<{ id: number; title: string }[]>([]);
    const [state, setState] = useState<FormDataProps<DynamicFormData>>(initialState);
    const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});
    const handleChange = createHandleChange(setState);

    useEffect(() => {
        if (data && roles.length > 0) {
            const validRole = roles.find((r) => r.id === data.role_id);
            setState({
                values: {
                    name: data.name,
                    username: data.username,
                    role_id: validRole ? data.role_id.toString() : "",
                    email: data.email
                },
                errors: { name: "", username: "", role_id: "", email: "" },
                loading: false
            });

            if (data.permissions) {
                setPermissions(data.permissions);
            }
        }
    }, [data, roles]);

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));
        const response = await roleList();
        if (response?.success) {
            setRoles(response.data.roles || []);
        }
        setState(prev => ({ ...prev, loading: false }));
    }, []);

    const handlePermissionChange = (permission: string) => {
        setPermissions(prev => ({
            ...prev,
            [permission]: !prev[permission],
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = {
            username: (!data || data.username) ? validateField("username", state.values.username) : "",
            email: (!data || data.email) ? validateField("email", state.values.email) : "",
            name: (!data || data.name) ? validateField("name", state.values.name) : "",
            role_id: validateField("role_id", state.values.role_id)
        };

        if (Object.values(errors).some(error => error)) {
            setState(prev => ({ ...prev, errors }));
            return;
        };

        setState(prev => ({ ...prev, loading: true }));

        const selectedPermissions = Object.entries(permissions).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        let response;
        if (data) {
            response = await userUpdate(data.id, {
                name: state.values.name,
                role_id: Number(state.values.role_id),
                permissions: selectedPermissions,
            });
        } else {
            response = await userCreate({
                name: state.values.name,
                role_id: Number(state.values.role_id),
                username: state.values.username,
                email: state.values.email,
                permissions: selectedPermissions
            });
        }

        if (response?.success) {
            toast.success(response.message);
            setState(initialState);
            setPermissions({});
            onClose(true);
        }
        setState(prev => ({ ...prev, loading: false }));
    };

    const handleClose = () => {
        onClose(false);
        setState(initialState);
        setPermissions({});
    };

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open, fetchData]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="xs">

            <DialogTitle>
                {data ? USER.EDIT : USER.CREATE}
            </DialogTitle>

            <DialogContent sx={{ paddingTop: "10px !important" }}>

                {(!data || data.name) && (
                    <Input
                        id="name"
                        label={USER.NAME}
                        name="name"
                        type="text"
                        maxLength={50}
                        value={state.values.name}
                        disabled={state.loading}
                        error={!!state.errors.name}
                        errorText={state.errors.name}
                        onChange={handleChange}
                        tabIndex={1}
                    />
                )}

                {!data && (
                    <>
                        <Input
                            id="username"
                            label={USER.USERNAME}
                            name="username"
                            type="text"
                            maxLength={50}
                            value={state.values.username}
                            disabled={state.loading}
                            error={!!state.errors.username}
                            errorText={state.errors.username}
                            onChange={handleChange}
                            tabIndex={2}
                        />

                        <Input
                            id="email"
                            label={USER.EMAIL}
                            name="email"
                            type="email"
                            maxLength={30}
                            value={state.values.email}
                            disabled={state.loading}
                            error={!!state.errors.email}
                            errorText={state.errors.email}
                            onChange={handleChange}
                            tabIndex={3}
                        />
                    </>
                )}

                <FormControl fullWidth disabled={state.loading} error={!!state.errors.role_id}>
                    <InputLabel sx={{ top: 1 }}>Role</InputLabel>
                    <Select
                        labelId="role-select-label"
                        label="Role"
                        value={state.values.role_id}
                        variant="outlined"
                        name="role_id"
                        onChange={(e: SelectChangeEvent<string>) =>
                            setState(prev => ({
                                ...prev,
                                values: { ...prev.values, role_id: e.target.value },
                                errors: { ...prev.errors, role_id: "" }
                            }))
                        }
                    >
                        {roles.map((r) => (
                            <MenuItem key={r.id} value={r.id.toString()}>
                                {r.title}
                            </MenuItem>
                        ))}
                    </Select>
                    {state.errors.role_id && (
                        <FormHelperText>{state.errors.role_id}</FormHelperText>
                    )}
                </FormControl>

                {Number(state.values.role_id) === ROLE.ADMIN && Object.entries(PERMISSIONS).map(([category, perms]) => (
                    <Box key={category} sx={{ marginTop: "10px" }}>
                        <Typography variant="h6">{category}</Typography>
                        <FormGroup>
                            <Grid container>
                                {perms.map(({ key, label }) => (
                                    <Grid item xs={4} key={key}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={permissions[key] || false}
                                                    onChange={() => handlePermissionChange(key)}
                                                />
                                            }
                                            label={label}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </FormGroup>
                    </Box>
                ))}
            </DialogContent>

            <DialogActions sx={{ px: "24px", py: 1 }}>
                <AppButton
                    id="cancel-button"
                    label={COMMON.CANCEL}
                    onClick={handleClose}
                    variant="text"
                    type="button"
                    tabIndex={3}
                />
                <AppButton
                    id="save"
                    label={data ? COMMON.SAVE_CHANGE : COMMON.CREATE}
                    onClick={handleSave}
                    textColor="primary"
                    type="submit"
                    loading={state.loading}
                    disabled={state.loading}
                    tabIndex={4}
                />
            </DialogActions>
        </Dialog>
    );
};

export default Add;
