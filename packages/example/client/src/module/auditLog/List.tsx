import { Box, Backdrop, CircularProgress, TableCell, TableRow, Grid, Paper, FormControl, InputLabel, TextField, Select, MenuItem } from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState, useCallback } from "react";
import { AuditLogProps, AuditLogTableProps, ColumnProps } from "../../types/types";
import { auditLogList } from "../../services/services";
import dayjs from 'dayjs';
import RouteGuard from "../../components/RouteGuard";
import RoleGuard from "../../components/RoleGuard";
import AppTable from "../../components/AppTable";
import AppButton from "../../components/Button";

const columns: ColumnProps[] = [
    { id: "updated_by_username", label: "Name", width: 10, align: "left" },
    { id: "table", label: "Table", width: 15, align: "left" },
    { id: "field", label: "Field", width: 15, align: "left" },
    { id: "record_id", label: "Record ID", width: 10, align: "right" },
    { id: "previous_value", label: "Previous Value", width: 20, align: "left" },
    { id: "new_value", label: "New Value", width: 20, align: "left" },
    { id: "updated_on", label: "Updated On", width: 10, align: "right" }
];

const List = () => {
    const [state, setState] = useState({
        auditLog: [] as AuditLogProps[],
        page: 0,
        limit: 100,
        count: 0,
        loading: false,
        tables: [] as AuditLogTableProps[],
        fields: [] as string[],
        filter: {
            start_date: dayjs().subtract(7, "day").toISOString(),
            end_date: dayjs().toISOString(),
            table: "",
            fields: [],
            record_id: ""
        }
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));

        const response = await auditLogList(state.page + 1, state.limit, state.filter);

        if (response?.success) {
            setState(prev => ({
                ...prev,
                auditLog: response?.data?.auditLogs,
                count: response?.data?.totalCount,
                tables: response?.data?.tables,
                loading: false
            }));
        };
        setState(prev => ({ ...prev, loading: false }));
    }, [state.page, state.limit, state.filter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 100);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleFilterChange = (key: string, value: any) => {
        setState(prev => ({
            ...prev,
            filter: { ...prev.filter, [key]: value }
        }));
    };

    const handleTableChange = (table: string) => {
        const selectedTable = state.tables.find((t) => t.table === table);
        setState(prev => ({
            ...prev,
            filter: { ...prev.filter, table, fields: [] },
            fields: selectedTable?.field || []
        }));
    };

    const resetFilters = () => {
        setState(prev => ({
            ...prev,
            filter: {
                start_date: dayjs().subtract(7, 'day').toISOString(),
                end_date: dayjs().toISOString(),
                table: "",
                fields: [],
                record_id: ""
            },
            fields: []
        }));
    };

    const renderRow = (row: AuditLogProps, columns: any) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
            {columns.map((column: any) => {
                let value: any;

                switch (column.id) {
                    case "updated_on":
                        value = row.updated_on ? dayjs(row.updated_on).format("DD/MM/YYYY") : ""; 
                        break;

                    default:
                        value = row[column.id as keyof AuditLogProps];
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
                    <Grid item sm={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Start Date"
                                format="DD/MM/YYYY"
                                value={dayjs(state.filter.start_date)}
                                onChange={(newValue) => handleFilterChange("start_date", newValue?.toISOString())}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item sm={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="End Date"
                                format="DD/MM/YYYY"
                                value={dayjs(state.filter.end_date)}
                                onChange={(newValue) => handleFilterChange("end_date", newValue?.toISOString())}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item sm={2}>
                        <FormControl fullWidth>
                            <InputLabel id="table">Table</InputLabel>
                            <Select
                                label="Table"
                                variant="outlined"
                                value={state.filter.table}
                                onChange={(e) => handleTableChange(e.target.value)}
                            >
                                {state.tables.map((t) => (
                                    <MenuItem key={t.table} value={t.table}>{t.table}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={2}>
                        <FormControl fullWidth>
                            <InputLabel>Field</InputLabel>
                            <Select
                                multiple
                                label="Field"
                                value={state.filter.fields}
                                onChange={(e) => handleFilterChange("fields", e.target.value)}
                            >
                                {state.fields.map((field) => (
                                    <MenuItem key={field} value={field}>{field}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={2}>
                        <TextField
                            label="Record ID"
                            value={state.filter.record_id}
                            onChange={(e) => handleFilterChange("record_id", e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item sm={2}>
                        <AppButton
                            id="Reset"
                            label="Reset"
                            onClick={resetFilters}
                            textColor="secondary"
                            type="button"
                            tabIndex={1}
                        />
                    </Grid>
                </Grid>
            </Box>
            <AppTable
                columns={columns}
                rows={state.auditLog}
                page={state.page}
                setPage={(page) => setState(prev => ({ ...prev, page }))}
                limit={state.limit}
                setLimit={(limit) => setState(prev => ({ ...prev, limit }))}
                count={state.count}
                renderRow={renderRow}
                loading={false}
            />
        </Paper>
    );
};

export default RoleGuard(RouteGuard(List));
