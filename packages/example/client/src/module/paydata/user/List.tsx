import { Box, Backdrop, CircularProgress, Grid, IconButton, Paper, TableCell, TableRow, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ColumnProps, PaydataUserProps } from "../../../types/types";
import { paydataUserList, paydataUserDelete } from "../../../services/services";
import RouteGuard from "../../../components/RouteGuard";
import RoleGuard from "../../../components/RoleGuard";
import Dialog from "../../../components/Dialog";
import AppTable from "../../../components/AppTable";
import AppButton from "../../../components/Button";
import Add from "./Add";

const columns: ColumnProps[] = [
    { id: "username", label: "Username", width: 35, align: "left" },
    { id: "display_name", label: "name", width: 35, align: "left" },
    { id: "code", label: "Code", width: 10, align: "left" },
    { id: "role_title", label: "Role", width: 10, align: "left" },
    { id: "actions", label: "Action", width: 10, align: "center" },
];

const List = () => {
    const [state, setState] = useState({
        user: [] as PaydataUserProps[],
        page: 0,
        limit: 100,
        count: 0,
        loading: false,
        openDialog: false,
        openDeleteDialog: false,
        userData: null as PaydataUserProps | null
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));
        const params = { page: state.page + 1, limit: state.limit };
        const response = await paydataUserList(params);
        if (response?.success) {
            setState(prev => ({
                ...prev,
                user: response.data.users,
                count: response.data.totalCount,
                loading: false
            }));
        }
        setState(prev => ({ ...prev, loading: false }));
    }, [state.page, state.limit]);

    const deleteUser = async () => {
        if (!state.userData) return;
        setState(prev => ({ ...prev, loading: true }));

        const response = await paydataUserDelete(state.userData.id);

        if (response?.success) {
            toast.success(response.message);
            fetchData();
        }
        setState(prev => ({ ...prev, loading: false, openDeleteDialog: false }));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 100);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const renderRow = (row: PaydataUserProps, columns: any) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
            {columns.map((column: any) => {
                let value: any;

                switch (column.id) {
                    case "actions":
                        value = (
                            <Box>
                                <Tooltip title="Change Role">
                                    <IconButton
                                        color="primary"
                                        onClick={() => setState(prev => ({ ...prev, openDialog: true, userData: row }))}
                                        sx={{ padding: 0, mx: 1 }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete User">
                                    <IconButton
                                        color="primary"
                                        onClick={() => setState(prev => ({ ...prev, openDeleteDialog: true, userData: row }))}
                                        sx={{ padding: 0 }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        );
                        break;

                    default:
                        value = row[column.id as keyof PaydataUserProps];
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
                <Grid container spacing={2} justifyContent="flex-end">
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
                open={state.openDeleteDialog}
                onClose={() => setState(prev => ({ ...prev, openDeleteDialog: false, userData: null }))}
                title="Delete User?"
                description="Are you sure you want to delete this user?"
                onConfirm={deleteUser}
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
