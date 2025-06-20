import { Backdrop, CircularProgress, TableCell, TableRow, Grid, Link, Paper, Box, Checkbox, FormControlLabel } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnProps, PaydataProps } from "../../types/types";
import { LOCAL_STORAGE, ROLE, ROUTE, STAGE } from "../../utils/constant";
import { paydataList } from "../../services/services";
import { getMonthName } from "../../utils/utils";
import RouteGuard from "../../components/RouteGuard";
import RoleGuard from "../../components/RoleGuard";
import AppTable from "../../components/AppTable";
import AppButton from "../../components/Button";
import Search from "../../components/Search";
import Add from './Add';
import dayjs from "dayjs";

const columns: ColumnProps[] = [
    { id: "title", label: "Title", width: 50, align: "left" },
    { id: "year", label: "Year", width: 5, align: "right" },
    { id: "month", label: "Month", width: 10, align: "left" },
    { id: "stage_title", label: "Stage", width: 10, align: "left" },
    { id: "created_on", label: "Created On", width: 10, align: "right" },
    { id: "created_by_display_name", label: "Created By", width: 20, align: "left" }
];

const List = () => {
    const [state, setState] = useState({
        paydata: [] as PaydataProps[],
        page: 0,
        limit: 100,
        count: 0,
        loading: false,
        openDialog: false,
        showArchived: false,
        showClosed: false,
        search_key: "",
        paydataData: null as PaydataProps | null
    });

    const navigate = useNavigate();
    const role = localStorage.getItem(LOCAL_STORAGE.ROLE_ID);
    const account = Number(role) === ROLE.ACCOUNT

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));

        const stage = [];
        if (state.showArchived) stage.push(STAGE.ARCHIVED);
        if (state.showClosed) stage.push(STAGE.CLOSED);

        const response = await paydataList(state.page + 1, state.limit, state.search_key.trim(), stage);
        if (response?.success) {
            setState(prev => ({
                ...prev,
                paydata: response?.data?.paydatas,
                count: response?.data?.totalCount,
                loading: false,
            }));
        };

        setState(prev => ({ ...prev, loading: false }));
    }, [state.page, state.limit, state.search_key, state.showArchived, state.showClosed]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 100);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const redirectPeople = (id: number) => {
        navigate(`${ROUTE.PAYDATA}/${id}${ROUTE.TRANSACTION}`);
    };

    const handleSearch = (search_key: string) => {
        setState(prev => ({ ...prev, search_key }));
    };

    const renderRow = (row: PaydataProps, columns: any) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
            {columns.map((column: any) => {
                let value: any;

                switch (column.id) {
                    case "title":
                        value = (
                            <Link
                                component="button"
                                onClick={() => redirectPeople(row.id)}
                                underline="hover"
                                color="primary"
                            >
                                {row.title}
                            </Link>
                        );
                        break;

                    case "month":
                        value = getMonthName(row.month)
                        break;

                    case "created_on":
                        value = row.created_on ? dayjs(row.created_on).format("DD/MM/YYYY") : ""; 
                        break;

                    default:
                        value = row[column.id as keyof PaydataProps];
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

                    {!account && (
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
                                            checked={state.showClosed}
                                            onChange={() => setState(prev => ({ ...prev, showClosed: !prev.showClosed }))}
                                            color="primary"
                                        />
                                    }
                                    label="Show Closed"
                                />
                            </Box>
                        </Grid>
                    )}
                    {!account && (
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
                    )}
                </Grid>
            </Box>

            <AppTable
                columns={columns}
                rows={state.paydata}
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
                        openDialog: false
                    }));
                    if (refresh) fetchData();
                }}
            />
        </Paper>
    );
};

export default RoleGuard(RouteGuard(List));