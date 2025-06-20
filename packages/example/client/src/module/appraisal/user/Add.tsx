import { Dialog, DialogTitle, DialogContent, DialogActions, FormHelperText, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, ListItem, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { debounce } from "lodash";
import { AddAppraisalUserProps, FormDataProps, DynamicFormData } from "../../../types/types";
import { appraisalUserCreate, appraisalUserUpdate, roleList, userList } from "../../../services/services";
import { COMMON, USER } from "../../../utils/constant";
import { createHandleChange, validateField } from "../../../utils/validation";
import AppButton from "../../../components/Button";
import Input from "../../../components/Input";

const initialState: FormDataProps<DynamicFormData> = {
    values: { appraisal_id: "", user_id: "", role_id: "", search_key: "" },
    errors: { name: "", role_id: "" },
    loading: false
};

const Add = ({ open, onClose, data }: AddAppraisalUserProps) => {
    const [state, setState] = useState<FormDataProps<DynamicFormData>>(initialState);
    const [roles, setRoles] = useState<{ id: number; title: string }[]>([]);
    const [users, setUsers] = useState<{ id: number, name: string, username: string, code: string }[]>([]);
    const handleChange = createHandleChange(setState);
    const { id } = useParams();

    useEffect(() => {
        if (data && roles.length > 0) {
            setState(prev => ({
                ...prev,
                values: { user_id: "", role_id: roles.some(r => r.id === data.role_id) ? data.role_id.toString() : "" },
                errors: { user_id: "", role_id: "" }
            }));
        } else {
            setState(initialState);
        }
    }, [data, roles]);

    useEffect(() => {
        if (!open) return;

        const fetchData = async () => {
            setState(prev => ({ ...prev, loading: true }));

            const response = await roleList();
            if (response?.success) {
                setRoles(response.data.roles || []);
            }

            setState(prev => ({ ...prev, loading: false }));
        };

        fetchData();
    }, [open]);

    const searchUsers = debounce(async (query: string) => {
        if (!query) return setUsers([]);
        setState(prev => ({ ...prev, loading: true }));

        const response = await userList({ search_key: query, page: 1, limit: 10 });
        const foundUsers = response && response.success ? response.data.users : [];

        setUsers(foundUsers);
        if (foundUsers.length === 0) {
            toast.info("No users found");
        }

        setState(prev => ({ ...prev, loading: false }));
    }, 500);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) return;

        const errors = {
            user_id: data ? "" : validateField("username", state.values.user_id),
            role_id: validateField("role_id", state.values.role_id)
        };

        if (Object.values(errors).some(error => error)) {
            setState(prev => ({ ...prev, errors }));
            return;
        };

        setState(prev => ({ ...prev, loading: true }));

        const response = data
            ? await appraisalUserUpdate({ role_id: Number(state.values.role_id), appraisal_id: Number(id), user_id: Number(data.user_id) })
            : await appraisalUserCreate({ role_id: Number(state.values.role_id), appraisal_id: Number(id), user_id: Number(state.values.user_id) })

        if (response?.success) {
            toast.success(response.message);
            setState(initialState);
            onClose(true);
        }
        setState(prev => ({ ...prev, loading: false }));
    };

    const handleClose = () => {
        setState(initialState);
        setUsers([]);
        onClose(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="xs">

            <DialogTitle>
                {data ? USER.EDIT : USER.CREATE}
            </DialogTitle>

            <DialogContent sx={{ paddingTop: "10px !important" }}>

                {!data && <Input
                    id="username"
                    label={USER.USERNAME}
                    name="username"
                    type="text"
                    maxLength={50}
                    value={state.values.search_key}
                    disabled={state.loading}
                    error={!!state.errors.user_id}
                    errorText={state.errors.user_id}
                    onChange={(e) => {
                        const value = e.target.value;
                        searchUsers(value);
                        setState(prev => ({
                            ...prev,
                            values: { ...prev.values, search_key: value },
                        }));
                        handleChange(e);
                    }}
                    placeholder="Search User by name or code"
                    tabIndex={1}
                />}

                {users.length > 0 && (
                    <Paper sx={{ mb: 2 }} >
                        {users.map((user) => (
                            <ListItem
                                key={user.id}
                                onClick={() => {
                                    setState(prev => ({
                                        ...prev,
                                        values: {
                                            ...prev.values,
                                            user_id: user.id.toString(),
                                            search_key: user.username
                                        },
                                        errors: { ...prev.errors, user_id: "" }
                                    }));
                                    setUsers([]);
                                }}
                            >
                                {user.username} ({user.code})
                            </ListItem>
                        ))}
                    </Paper>
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
