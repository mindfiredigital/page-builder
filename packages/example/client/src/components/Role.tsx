import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, FormControlLabel, Checkbox, InputLabel, MenuItem, Select, FormHelperText } from "@mui/material";
import { useEffect, useState, useCallback, useRef } from "react";
import { RoleProps, RoleStateProps } from "../types/types";
import { roleList } from "../services/services";
import { COMMON } from "../utils/constant";
import AppButton from "./Button";

const Role: React.FC<RoleProps> = ({ open, onClose, onSave, selectedRoleIds = [], singleSelection = false }) => {
    const [state, setState] = useState<RoleStateProps>({
        role: [],
        loading: false,
        selectedRoles: [],
        selectedRole: "",
        error: ""
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));

        const response = await roleList();
        if (response && response.success) {
            setState(prevState => ({
                ...prevState,
                role: response?.data?.roles || [],
                loading: false,
            }));
        }

        setState(prev => ({ ...prev, loading: false }));
    }, []);

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open, fetchData]);

    const prevSelectedRoleIdsRef = useRef(JSON.stringify(selectedRoleIds));
    const prevSingleSelectionRef = useRef(singleSelection);

    useEffect(() => {
        const prevSelectedRoleIds = prevSelectedRoleIdsRef.current;
        const currentSelectedRoleIds = JSON.stringify(selectedRoleIds);
        const prevSingleSelection = prevSingleSelectionRef.current;

        if (prevSelectedRoleIds !== currentSelectedRoleIds || prevSingleSelection !== singleSelection) {
            if (singleSelection) {
                setState(prev => ({ ...prev, selectedRole: "", selectedRoles: [] }));
            } else {
                setState(prev => ({ ...prev, selectedRoles: selectedRoleIds, selectedRole: "" }));
            }
            setState(prev => ({ ...prev, error: "" }));
        }

        prevSelectedRoleIdsRef.current = currentSelectedRoleIds;
        prevSingleSelectionRef.current = singleSelection;
    }, [selectedRoleIds, singleSelection]);

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const roleId = Number(event.target.value);
        setState(prev => ({
            ...prev,
            selectedRoles: event.target.checked
                ? [...prev.selectedRoles, roleId]
                : prev.selectedRoles.filter(id => id !== roleId)
        }));
        setState(prev => ({ ...prev, error: "" }));
    };

    const handleSingleRoleChange = (event: any) => {
        setState(prev => ({
            ...prev,
            selectedRole: event.target.value
        }));
        setState(prev => ({ ...prev, error: "" }));
    };

    const handleClose = () => {
        setState(prev => ({ ...prev, role: [], loading: false, selectedRole: "", selectedRoles: [], error: "" }));
        onClose();
    };

    const handleSave = () => {
        if (singleSelection) {
            if (!state.selectedRole) {
                setState(prev => ({ ...prev, error: "Role is required" }));
                return;
            }
            onSave(Number(state.selectedRole));
        } else {
            if (state.selectedRoles.length === 0) {
                setState(prev => ({ ...prev, error: "At least one role must be selected" }));
                return;
            }
            onSave(state.selectedRoles);
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { margin: "8px", minWidth: "300px" } }}>
            <DialogTitle>Select Role for User</DialogTitle>
            <DialogContent sx={{ px: 2 }}>
                {singleSelection ? (
                    <FormControl fullWidth disabled={state.loading} error={!!state.error}>
                        <InputLabel sx={{ marginTop: 2 }}>
                            Role
                        </InputLabel>
                        <Select
                            labelId="role-select-label"
                            value={state?.selectedRole}
                            label="Role"
                            variant="outlined"
                            onChange={handleSingleRoleChange}
                            sx={{ marginTop: 2 }}
                        >
                            {state?.role?.map((r) => (
                                <MenuItem key={r.id} value={r.id}>
                                    {r.title}
                                </MenuItem>
                            ))}
                        </Select>
                        {state.error && <FormHelperText>{state.error}</FormHelperText>}
                    </FormControl>
                ) : (
                    <FormControl fullWidth disabled={state.loading} error={!!state.error}>
                        <FormGroup>
                            {state?.role?.map((r) => (
                                <FormControlLabel
                                    key={r.id}
                                    control={
                                        <Checkbox
                                            value={r.id}
                                            checked={state?.selectedRoles.includes(r.id)}
                                            onChange={handleRoleChange}
                                        />
                                    }
                                    label={r.title}
                                    sx={{ alignItems: "center", paddingLeft: 1 }}
                                />
                            ))}
                        </FormGroup>
                        {state.error && <FormHelperText>{state.error}</FormHelperText>}
                    </FormControl>
                )}
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
                    label={COMMON.SAVE}
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

export default Role;
