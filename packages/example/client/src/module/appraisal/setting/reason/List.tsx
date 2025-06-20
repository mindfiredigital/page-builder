import { Backdrop, Checkbox, CircularProgress, FormControlLabel, TableCell, TableRow, Tabs, Tab, Grid, Paper, Box, Switch, Tooltip, IconButton } from "@mui/material";
import { DriveFileRenameOutline } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AppraisalReasonProps, ColumnProps } from "../../../../types/types";
import { toast } from "sonner";
import { appraisalReasonList, appraisalReasonUpdate, appraisalReasonImport } from "../../../../services/services";
import { LOCAL_STORAGE } from "../../../../utils/constant";
import RouteGuard from "../../../../components/RouteGuard";
import RoleGuard from "../../../../components/RoleGuard";
import AppTable from "../../../../components/AppTable";
import AppButton from "../../../../components/Button";
import Search from "../../../../components/Search";
import ImportSelection from "../../../../components/ImportSelection";
import Add from './Add';
import ListLevel from "../level/List";

const columns: ColumnProps[] = [
    { id: "title", label: "Title", width: 90, align: "left" },
    { id: "is_active", label: "Active", width: 5, align: "left" },
    { id: "actions", label: "Actions", width: 5, align: "center" },
];

const List = () => {
    const [state, setState] = useState({
        reason: [] as AppraisalReasonProps[],
        page: 0,
        limit: 100,
        count: 0,
        loading: false,
        openDialog: false,
        openAppraisalDialog: false,
        search_key: "",
        showActive: false,
        activeTab: 0,
        reasonData: null as AppraisalReasonProps | null
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

        const response = await appraisalReasonList(params);

        if (response?.success) {
            setState(prev => ({
                ...prev,
                reason: response?.data?.reasons,
                count: response?.data?.totalCount,
                loading: false
            }));
        };

        setState(prev => ({ ...prev, loading: false }));
    }, [id, state.page, state.limit, state.showActive, state.search_key]);

    const handleToggleActive = async (row: AppraisalReasonProps) => {
        if (!row || row.id === undefined) return;

        setState(prev => ({ ...prev, loading: true }));

        const payload: { is_active: boolean } = { is_active: !row.is_active };

        const response = await appraisalReasonUpdate(row.id, payload);

        if (response?.success) {
            toast.success(response.message);
            fetchData();
        }

        setState(prev => ({ ...prev, loading: false }));
    };

    const saveData = async (appraisal_id: number) => {
        if (!appraisal_id) return;
        setState(prev => ({ ...prev, loading: true }));

        const response = await appraisalReasonImport({ current_appraisal_id: Number(id), import_appraisal_id: Number(appraisal_id) });
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

    useEffect(() => {
        const activeTab = localStorage.getItem(LOCAL_STORAGE.ACTIVE_TAB);
        if (activeTab !== null) {
            setState(prev => ({ ...prev, activeTab: Number(activeTab) }));
        }
    }, []);

    const handleSearch = (search_key: string) => {
        setState(prev => ({ ...prev, search_key }));
    };

    const onRename = (row: AppraisalReasonProps) => {
        setState(prev => ({
            ...prev,
            reasonData: row,
            openDialog: true
        }));
    };

    const renderRow = (row: AppraisalReasonProps, columns: any) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
            {columns.map((column: any) => {
                let value: any;

                switch (column.id) {
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
                        value = row[column.id as keyof AppraisalReasonProps];
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

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        localStorage.setItem(LOCAL_STORAGE.ACTIVE_TAB, String(newValue));
        setState(prev => ({ ...prev, activeTab: newValue }));
    };

    return (
        <Paper>
            <Tabs
                value={state.activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab label="In Eligibility Reason" />
                <Tab label="Revision Level" />
            </Tabs>

            <Backdrop
                open={state.loading}
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {state.activeTab === 1 && <ListLevel />}

            {state.activeTab === 0 &&
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
            }

            {state.activeTab === 0 &&
                <Box>
                    <AppTable
                        columns={columns}
                        rows={state.reason}
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
                                reasonData: null,
                            }));
                            if (refresh) fetchData();
                        }}
                        data={state.reasonData}
                    />

                    <ImportSelection
                        open={state.openAppraisalDialog}
                        onClose={() => setState(prev => ({ ...prev, openAppraisalDialog: false }))}
                        onSave={saveData}
                    />
                </Box>
            }
        </Paper>
    );
};

export default RoleGuard(RouteGuard(List));