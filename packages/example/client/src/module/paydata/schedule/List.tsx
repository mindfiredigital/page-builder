import { Backdrop, CircularProgress, TableCell, TableRow, Grid, Paper, Box, Checkbox, FormControlLabel, Switch, Tooltip, IconButton } from "@mui/material";
import { DriveFileRenameOutline } from "@mui/icons-material"
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ColumnProps } from "../../../types/types";
import { paydataScheduleList, paydataScheduleUpdate } from "../../../services/services";
import { getMonthName } from "../../../utils/utils";
import RouteGuard from "../../../components/RouteGuard";
import AppTable from "../../../components/AppTable";
import AppButton from "../../../components/Button";
import Search from "../../../components/Search";
import Add from './Add';

const columns: ColumnProps[] = [
    { id: "people_name", label: "People", width: 5, align: "left" },
    { id: "people_code", label: "Code", width: 5, align: "left" },
    { id: "people_lead_name", label: "Lead", width: 10, align: "left" },
    { id: "paydata_type_title", label: "Paydata Type", width: 8, align: "left" },
    { id: "currency", label: "Currency", width: 5, align: "left" },
    { id: "amount", label: "Amount", width: 2, align: "right" },
    { id: "note", label: "Note", width: 35, align: "left" },
    { id: "start_year", label: "Start Year", width: 7, align: "right" },
    { id: "start_month", label: "Start Month", width: 8, align: "right" },
    { id: "repeat_month_frequency", label: "Repeat Frequency", width: 11, align: "right" },
    { id: "is_archive", label: "Archive", width: 10, align: "center" },
    { id: "actions", label: "Actions", width: 20, align: "center" },
];

const List = () => {
    const [state, setState] = useState({
        paydataSchedule: [] as any[],
        page: 0,
        limit: 100,
        count: 0,
        loading: false,
        openDialog: false,
        showArchived: false,
        showExpired: false,
        search_key: "",
        paydataScheduleData: null as any | null
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));

        const params = {
            page: state.page + 1,
            limit: state.limit,
            search_key: state.search_key,
            ...(state.showArchived ? { is_archive: 1 } : {}),
            ...(state.showExpired ? { is_expired: 1 } : {})
        };

        const response = await paydataScheduleList(params);

        if (response?.success) {
            setState(prev => ({
                ...prev,
                paydataSchedule: response?.data?.paydataSchedules,
                count: response?.data?.totalCount,
                loading: false
            }));
        };

        setState(prev => ({ ...prev, loading: false }));
    }, [state.page, state.limit, state.search_key, state.showArchived, state.showExpired]);

    const updateArchive = async (row: any) => {

        setState(prev => ({
            ...prev,
            paydataSchedule: prev.paydataSchedule.map(schedule =>
                schedule.id === row.id
                    ? { ...schedule, is_archive: !schedule.is_archive }
                    : schedule
            ),
        }));

        const payload = { is_archive: !row.is_archive };

        const response = await paydataScheduleUpdate(row.id, payload);

        if (response?.success) {
            toast.success(response.message);
        }
        setState((prev) => ({ ...prev, loading: false }));
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

    const onRename = (row: any) => {
        setState(prev => ({
            ...prev,
            paydataScheduleData: row,
            openDialog: true
        }));
    };

    const renderRow = (row: any, columns: any) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
            {columns.map((column: any) => {
                let value: any;

                switch (column.id) {
                    case "is_archive":
                        value = (
                            <span>
                                <Switch
                                    checked={Boolean(row.is_archive)}
                                    onChange={() => updateArchive(row)}
                                    color="primary"
                                    disabled={Boolean(row.is_expired)}
                                />
                            </span>
                        );
                        break;

                    case "start_month":
                        value = getMonthName(row.start_month);
                        break;

                    case "people_lead_name":
                        value = (
                            <div style={{ whiteSpace: "pre-line" }}>
                                {row.people_lead_name?.split(",").map((code: string, index: number) => (
                                    <div key={index}>{code.trim()}</div>
                                ))}
                            </div>
                        );
                        break;

                    case "actions":
                        value = (
                            <Box>
                                <Tooltip title="Edit">
                                    <span>
                                        <IconButton
                                            color="primary"
                                            onClick={() => onRename(row)}
                                            disabled={Boolean(row.is_expired)}
                                            sx={{ padding: 0 }}
                                        >
                                            <DriveFileRenameOutline />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Box>
                        );
                        break;

                    default:
                        value = row[column.id as keyof any];
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
                            backgroundColor: row.is_expired ? "#E0B0B0" : "inherit",
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

                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.showArchived}
                                        onChange={() => setState(prev => ({ ...prev, showArchived: !prev.showArchived }))}
                                        color="primary"
                                    />
                                }
                                label="Show Archived"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.showExpired}
                                        onChange={() => setState(prev => ({ ...prev, showExpired: !prev.showExpired }))}
                                        color="primary"
                                    />
                                }
                                label="Show Expired"
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
                rows={state.paydataSchedule}
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
                        paydataScheduleData: null,
                    }));
                    if (refresh) fetchData();
                }}
                onSave={fetchData}
                data={state.paydataScheduleData}
            />
        </Paper>
    );
};

export default RouteGuard(List);