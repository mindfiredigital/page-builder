import { Box, Backdrop, CircularProgress, Grid, IconButton, Paper, TableCell, TableRow, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ColumnProps, AppraisalUserProps } from "../../../types/types";
import { appraisalUserList, appraisalUserDelete } from "../../../services/services";
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
    { id: "role_name", label: "Role", width: 10, align: "left" },
    { id: "actions", label: "Action", width: 10, align: "center" },
];

const List = () => {
    const [state, setState] = useState({
        user: [] as AppraisalUserProps[],
        page: 0,
        limit: 100,
        count: 0,
        loading: false,
        openDialog: false,
        openDeleteDialog: false,
        userData: null as AppraisalUserProps | null
    });

    const { id } = useParams();

    const fetchData = useCallback(async () => {
        if (!id) return;

        setState(prev => ({ ...prev, loading: true }));

        const params = { id: Number(id), page: state.page + 1, limit: state.limit };

        const response = await appraisalUserList(params);
        if (response?.success) {
            setState(prev => ({
                ...prev,
                user: response.data.users,
                count: response.data.totalCount,
                loading: false
            }));
        }
        setState(prev => ({ ...prev, loading: false }));
    }, [id, state.page, state.limit]);

    const deleteUser = async () => {
        if (!state.userData) return;
        setState(prev => ({ ...prev, loading: true }));

        const response = await appraisalUserDelete({ user_id: state.userData.user_id, appraisal_id: Number(id), role_id: state.userData.role_id });

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

    const renderRow = (row: AppraisalUserProps, columns: any) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.user_id}>
            {columns.map((column: any) => {
                let value: any;

                switch (column.id) {
                    case "actions":
                        value = (
                            <Box>
                                <Tooltip title="Change Role">
                                    <IconButton
                                        sx={{ padding: 0, mx: 1 }}
                                        color="primary"
                                        onClick={() => setState(prev => ({ ...prev, openDialog: true, userData: row }))}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete User">
                                    <IconButton
                                        sx={{ padding: 0 }}
                                        color="primary"
                                        onClick={() => setState(prev => ({ ...prev, openDeleteDialog: true, userData: row }))}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        );
                        break;

                    default:
                        value = row[column.id as keyof AppraisalUserProps];
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
