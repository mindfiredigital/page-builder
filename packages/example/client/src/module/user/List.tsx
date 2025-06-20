import { Box, Backdrop, Checkbox, CircularProgress, FormControlLabel, Grid, IconButton, Paper, Switch, TableCell, TableRow, Tooltip } from "@mui/material";
import { DriveFileRenameOutline, LockReset } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ColumnProps, UserProps } from "../../types/types";
import { userList, userUpdate, resetPassword } from "../../services/services";
import Search from "../../components/Search";
import Dialog from "../../components/Dialog";
import AppTable from "../../components/AppTable";
import AppButton from "../../components/Button";
import Add from "./Add";
import RouteGuard from "../../components/RouteGuard";
import RoleGuard from "../../components/RoleGuard";

const columns: ColumnProps[] = [
    { id: "code", label: "Code", width: 7, align: "left" },
    { id: "username", label: "Username", width: 10, align: "left" },
    { id: "email", label: "Email", width: 15, align: "left" },
    { id: "display_name", label: "Name", width: 25, align: "left" },
    { id: "role_title", label: "Role", width: 25, align: "left" },
    { id: "is_active", label: "Active", width: 10, align: "center" },
    { id: "actions", label: "Actions", width: 10, align: "center" },
];

const List = () => {
    const [state, setState] = useState({
        user: [] as UserProps[],
        page: 0,
        limit: 100,
        count: 0,
        loading: false,
        openDialog: false,
        search_key: "",
        actionMessage: "",
        openActionDialog: false,
        openResetDialog: false,
        showActive: true,
        userData: null as UserProps | null
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));

        const params = {
            page: state.page + 1,
            limit: state.limit,
            search_key: state.search_key,
            ...(state.showActive ? { is_active: 1 } : { is_active: 0 }),
        };

        const response = await userList(params);
        if (response?.success) {
            setState(prev => ({
                ...prev,
                user: response?.data?.users,
                count: response?.data?.totalCount,
                loading: false
            }));
        };

        setState(prev => ({ ...prev, loading: false }));
    }, [state.page, state.limit, state.search_key, state.showActive]);

    const updateOrResetPasswordUser = async (type: string) => {
        if (!state.userData) return;

        setState(prev => ({ ...prev, loading: true }));

        let response;
        if (type === "toggle") {
            response = await userUpdate(state.userData.id, { is_active: !state.userData.is_active });
        } else {
            response = await resetPassword({ id: state.userData.id, email: state.userData.email });
        };

        if (response?.success) {
            toast.success(response.message);
            fetchData();
        }
        setState(prev => ({ ...prev, loading: false, openActionDialog: false }));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 100);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleSearch = (search_key: string) => {
        setState(prev => ({ ...prev, search_key }));
    };

    const onRename = (row: UserProps) => {
        setState(prev => ({
            ...prev,
            userData: row,
            openDialog: true
        }));
    };

    const dialogOpen = (row: UserProps, type: "toggle" | "reset") => {
        setState(prev => ({ ...prev, userData: row }));

        if (type === "toggle") {
            const actionMessage = row.is_active
                ? "Deactivating this user will set them to an inactive state, requiring a password reset to reactivate the account."
                : "Activating this user will allow login. Are you sure you want to activate this user?";
            setState(prev => ({ ...prev, actionMessage, openActionDialog: true }));
        } else {
            setState(prev => ({ ...prev, openResetDialog: true }));
        }
    };

    const renderRow = (row: UserProps, columns: any) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
            {columns.map((column: any) => {
                let value: any;

                switch (column.id) {
                    case "is_active":
                        value = (
                            <Switch
                                checked={Boolean(row.is_active)}
                                onChange={() => dialogOpen(row, "toggle")}
                                inputProps={{ "aria-label": "active status" }}
                            />
                        );
                        break;

                    case "actions":
                        value = (
                            <>
                                <Tooltip title="Reset Password">
                                    <IconButton color="primary" onClick={() => dialogOpen(row, "reset")} sx={{ padding: 0 }}>
                                        <LockReset />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit User">
                                    <IconButton color="primary" onClick={() => onRename(row)} sx={{ padding: 0 }}>
                                        <DriveFileRenameOutline />
                                    </IconButton>
                                </Tooltip>
                            </>
                        );
                        break;
                    default:
                        value = row[column.id as keyof UserProps];
                }

                return (
                    <TableCell
                        key={String(column.id)}
                        align={column.align}
                        style={{
                            width: `${column.width}%`,
                            maxWidth: `${column.width}%`,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {value}
                    </TableCell>
                );
            })}
        </TableRow>
    );

    return (
        <Paper>
            <Backdrop
                open={state.loading}
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Search onSearch={handleSearch} />
                    </Grid>

                    <Grid item sm={4}>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.showActive}
                                        onChange={() => setState(prev => ({ ...prev, showActive: !prev.showActive }))}
                                        color="primary"
                                    />
                                }
                                label="Show Active"
                            />
                        </Box>
                    </Grid>

                    <Grid item sm={2}>
                        <AppButton
                            id="addNew"
                            label="Add New"
                            onClick={() => setState(prev => ({ ...prev, openDialog: true }))}
                            textColor="primary"
                            type="button"
                            tabIndex={1}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Dialog
                open={state.openActionDialog}
                onClose={() => setState(prev => ({ ...prev, openActionDialog: false }))}
                title="Activate or Deactivate User"
                description={state.actionMessage}
                onConfirm={() => updateOrResetPasswordUser("toggle")}
            />
            <Dialog
                open={state.openResetDialog}
                onClose={() => setState(prev => ({ ...prev, openResetDialog: false }))}
                title="Reset User Password?"
                description="On confirmation, the user will receive an email to reset their password."
                onConfirm={() => updateOrResetPasswordUser("reset")}
            />

            <AppTable
                columns={columns}
                rows={state.user}
                page={state.page}
                setPage={(page) => setState(prev => ({ ...prev, page }))}
                limit={state.limit}
                setLimit={(limit) => setState(prev => ({ ...prev, limit }))}
                count={state.count}
                renderRow={renderRow}
                loading={false}
            />

            <Add
                open={state.openDialog}
                onClose={(refresh?: boolean) => {
                    setState(prev => ({
                        ...prev,
                        openDialog: false,
                        userData: null,
                    }));
                    if (refresh) fetchData();
                }}
                data={state.userData}
            />
        </Paper>
    );
};

export default RoleGuard(RouteGuard(List));