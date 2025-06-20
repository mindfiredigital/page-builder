import { Backdrop, Checkbox, CircularProgress, FormControlLabel, TableCell, Grid, Paper, Box, Switch, Tooltip, IconButton } from "@mui/material";
import { DriveFileRenameOutline } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AppraisalLevelProps, ColumnProps } from "../../../../types/types";
import { toast } from "sonner";
import { appraisalLevelList, appraisalLevelUpdate, appraisalLevelImport, appraisalLevelReorder } from "../../../../services/services";
import RouteGuard from "../../../../components/RouteGuard";
import RoleGuard from "../../../../components/RoleGuard";
import AppTable from "../../../../components/AppTable";
import AppButton from "../../../../components/Button";
import Search from "../../../../components/Search";
import ImportSelection from "../../../../components/ImportSelection";
import Add from './Add';

const columns: ColumnProps[] = [
    { id: "title", label: "Title", width: 50, align: "left" },
    { id: "roles", label: "Roles", width: 40, align: "left" },
    { id: "is_active", label: "Active", width: 5, align: "left" },
    { id: "actions", label: "Actions", width: 5, align: "center" },
];

const List = () => {
    const [state, setState] = useState({
        level: [] as AppraisalLevelProps[],
        page: 0,
        limit: 100,
        count: 0,
        loading: false,
        openDialog: false,
        openAppraisalDialog: false,
        search_key: "",
        showActive: false,
        activeTab: 0,
        draggedItemIndex: null as number | null,
        levelData: null as AppraisalLevelProps | null
    });

    const { id } = useParams();

    const fetchData = useCallback(async () => {

        setState(prev => ({ ...prev, loading: true }));

        const params = {
            id: Number(id),
            page: state.page + 1,
            limit: state.limit,
            search_key: state.search_key,
            ...(state.showActive ? { is_active: 1 } : {}),
        };

        const response = await appraisalLevelList(params);

        if (response?.success) {
            setState(prev => ({
                ...prev,
                level: response?.data?.levels,
                count: response?.data?.totalCount,
                loading: false
            }));
        };

        setState(prev => ({ ...prev, loading: false }));
    }, [id, state.page, state.limit, state.showActive, state.search_key]);

    const handleToggleActive = async (row: AppraisalLevelProps) => {
        if (!row || row.id === undefined) return;

        setState(prev => ({ ...prev, loading: true }));

        const payload: { is_active: boolean } = { is_active: !row.is_active };

        const response = await appraisalLevelUpdate(row.id, payload);

        if (response?.success) {
            toast.success(response.message);
            fetchData();
        };

        setState(prev => ({ ...prev, loading: false }));
    };

    const saveData = async (appraisal_id: number) => {
        if (!appraisal_id) return;

        setState(prev => ({ ...prev, loading: true }));

        const response = await appraisalLevelImport({ current_appraisal_id: Number(id), import_appraisal_id: Number(appraisal_id) });
        if (response?.success) {
            toast.success(response.message, { duration: 3000 });
            fetchData();
        };

        setState(prev => ({ ...prev, loading: false }));
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

    const onRename = (row: AppraisalLevelProps) => {
        setState(prev => ({
            ...prev,
            levelData: row,
            openDialog: true
        }));
    };

    const handleReorder = async (dragId: number, dropId: number) => {
        const response = await appraisalLevelReorder({ drag_id: dragId, drop_id: dropId });
        if (response?.success) {
            toast.success(response.message);
            fetchData();
        }
        setState(prev => ({ ...prev, loading: false }));
    };

    const renderRow = (row: AppraisalLevelProps, columns: ColumnProps[]) => {
        return columns.map((column: ColumnProps) => {
            let value: any;

            switch (column.id) {
                case "roles":
                    value = Array.isArray(row?.roles)
                        ? row?.roles
                            .filter(role => role)
                            .map(role => role.role_name)
                            .join(", ")
                        : "";
                    break;

                case "is_active":
                    value = (
                        <Switch
                            checked={Boolean(row.is_active)}
                            onChange={() => handleToggleActive(row)}
                            inputProps={{ "aria-label": "active status" }}
                        />
                    );
                    break;

                case "actions":
                    value = (
                        <Box>
                            <Tooltip title="Edit Reason">
                                <IconButton color="primary" onClick={() => onRename(row)} sx={{ padding: 0 }}>
                                    <DriveFileRenameOutline />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    );
                    break;

                default:
                    value = row[column.id as keyof AppraisalLevelProps];
            }

            return (
                <TableCell
                    key={column.id}
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
        });
    };

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

                    <Grid item sm={2}>
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

                    <Grid item sm={2}>
                        <AppButton
                            id="import"
                            label="Import Appraisal"
                            onClick={() => setState(prev => ({ ...prev, openAppraisalDialog: true }))}
                            textColor="primary"
                            type="button"
                            tabIndex={1}
                        />
                    </Grid>
                </Grid>
            </Box>

            <AppTable
                columns={columns}
                rows={state.level}
                page={state.page}
                setPage={(page) => setState(prev => ({ ...prev, page }))}
                limit={state.limit}
                setLimit={(limit) => setState(prev => ({ ...prev, limit }))}
                count={state.count}
                renderRow={renderRow}
                loading={false}
                rearrangeCheck={true}
                onRowReorder={handleReorder}
            />

            <Add
                open={state.openDialog}
                onClose={(refresh?: boolean) => {
                    setState(prev => ({
                        ...prev,
                        openDialog: false,
                        levelData: null,
                    }));
                    if (refresh) fetchData();
                }}
                data={state.levelData}
            />

            <ImportSelection
                open={state.openAppraisalDialog}
                onClose={() => setState(prev => ({ ...prev, openAppraisalDialog: false }))}
                onSave={saveData}
            />
        </Paper>
    );
};

export default RoleGuard(RouteGuard(List));
