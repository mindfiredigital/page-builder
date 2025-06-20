import { Backdrop, Checkbox, CircularProgress, FormControlLabel, TableCell, TableRow, Tabs, Tab, Grid, Paper, Box, Switch, Tooltip, IconButton } from "@mui/material";
import { DriveFileRenameOutline } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { ColumnProps } from "../../../../types/types";
import { toast } from "sonner";
import { PaydataTypeProps } from "../../../../types/types";
import { paydataTypeList, paydataTypeUpdate } from "../../../../services/services";
import RouteGuard from "../../../../components/RouteGuard";
import RoleGuard from "../../../../components/RoleGuard";
import AppTable from "../../../../components/AppTable";
import AppButton from "../../../../components/Button";
import Search from "../../../../components/Search";
import Add from './Add';

const columns: ColumnProps[] = [
    { id: "title", label: "Title", width: 30, align: "left" },
    { id: "payment_type", label: "Payment Type", width: 30, align: "left" },
    { id: "is_recurring", label: "Recurring", width: 20, align: "left" },
    { id: "is_active", label: "Active", width: 10, align: "center" },
    { id: "actions", label: "Actions", width: 10, align: "center" },
];

const List = () => {
    const [state, setState] = useState({
        paydataType: [] as PaydataTypeProps[],
        page: 0,
        limit: 100,
        count: 0,
        loading: false,
        openDialog: false,
        search_key: "",
        showActive: false,
        paydataTypeData: null as PaydataTypeProps | null
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));

        const params = {
            page: state.page + 1,
            limit: state.limit,
            search_key: state.search_key,
            ...(state.showActive ? { is_active: 1 } : {}),
        };

        const response = await paydataTypeList(params);

        if (response?.success) {
            setState(prev => ({
                ...prev,
                paydataType: response?.data?.paydataTypes,
                count: response?.data?.totalCount,
                loading: false
            }));
        };

        setState(prev => ({ ...prev, loading: false }));
    }, [state.page, state.limit, state.search_key, state.showActive]);

    const handleToggleActive = async (row: PaydataTypeProps) => {
        setState(prev => ({ ...prev, loading: true }));

        const payload: { is_active: boolean, is_child?: boolean } = { is_active: !row.is_active };

        let is_child = false;
        if (row.parent_title !== "None") {
            const parent: any = state.paydataType.find(item => item.title === row.parent_title);
            if (parent && parent.is_active === 0) {
                is_child = true;
            };
        };

        if (is_child) {
            payload.is_child = true;
        };

        const response = await paydataTypeUpdate(row.id, payload);

        if (response?.success) {
            toast.success(response.message);
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

    const onRename = (row: PaydataTypeProps) => {
        setState(prev => ({
            ...prev,
            paydataTypeData: row,
            openDialog: true
        }));
    };

    const renderRow = (row: PaydataTypeProps, columns: any) => (
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
                                <Tooltip title="Edit Paydata Type">
                                    <IconButton color="primary" onClick={() => onRename(row)} sx={{ padding: 0 }}>
                                        <DriveFileRenameOutline />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        );
                        break;

                    default:
                        value = row[column.id as keyof PaydataTypeProps];
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
            <Tabs value={0} indicatorColor="primary" textColor="primary">
                <Tab label="Paydata Type" />
            </Tabs>

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

            <AppTable
                columns={columns}
                rows={state.paydataType}
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
                        paydataTypeData: null,
                    }));
                    if (refresh) fetchData();
                }}
                data={state.paydataTypeData}
                parentOptions={state.paydataType}
            />
        </Paper>
    );
};

export default RoleGuard(RouteGuard(List));