import { Box, Backdrop, CircularProgress, Checkbox, Grid, Paper, FormControlLabel, IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import { Block, CheckCircle, ManageAccounts } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ColumnProps, PeopleProps } from "../../types/types";
import { peopleList, peopleCreate } from "../../services/services";
import { getHiddenEmail } from "../../utils/utils";
import RouteGuard from "../../components/RouteGuard";
import RoleGuard from "../../components/RoleGuard";
import AppTable from "../../components/AppTable";
import Search from "../../components/Search";
import Role from "../../components/Role";
import dayjs from "dayjs";

const columns: ColumnProps[] = [
    { id: "code", label: "Code", width: 6, align: "left" },
    { id: "username", label: "Username", width: 9, align: "left" },
    { id: "email", label: "Email", width: 15, align: "left" },
    { id: "name", label: "Name", width: 10, align: "left" },
    { id: "lead_names", label: "Lead", width: 15, align: "left" },
    { id: "doj", label: "DOJ", width: 10, align: "center" },
    { id: "experience", label: "Experience", width: 10, align: "center" },
    { id: "branch", label: "Branch", width: 10, align: "left" },
    { id: "gender", label: "Gender", width: 5, align: "center" },
    { id: "is_active", label: "Active", width: 5, align: "center" },
    { id: "actions", label: "Actions", width: 5, align: "center" },
];

const List = () => {
    const [state, setState] = useState({
        people: [] as PeopleProps[],
        page: 0,
        limit: 100,
        count: 0,
        loading: false,
        openDialog: false,
        showActive: true,
        search_key: "",
        selectedPeople: ""
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));

        const params = {
            page: state.page + 1,
            limit: state.limit,
            search_key: state.search_key,
            ...(state.showActive ? { is_active: 1 } : { is_active: 0 }),
        };

        const response = await peopleList(params);
        if (response?.success) {
            setState(prev => ({
                ...prev,
                people: response?.data?.peoples,
                count: response?.data?.totalCount,
                loading: false
            }));
        };
        setState(prev => ({ ...prev, loading: false }));
    }, [state.page, state.limit, state.search_key, state.showActive]);

    const saveData = async (role: number | number[] | null) => {
        if (!role || Array.isArray(role)) return;
        setState(prev => ({ ...prev, loading: true }));

        const payload = { role_id: role, code: state.selectedPeople };

        const response = await peopleCreate(payload);
        if (response?.success) {
            toast.success(response.message, { duration: 2000 });
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
        const handleStorageEvent = () => {
            fetchData();
        };
    
        window.addEventListener("storage", handleStorageEvent);
        
        return () => {
            window.removeEventListener("storage", handleStorageEvent);
        };
    }, [fetchData]);

    const handleSearch = (search_key: string) => {
        setState(prev => ({ ...prev, search_key }));
    };

    const renderRow = (row: PeopleProps, columns: any) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
            {columns.map((column: any) => {
                let value: any;

                switch (column.id) {
                    case "email":
                        value = getHiddenEmail(row.email, 25);
                        break;

                    case "doj":
                        value = row.doj ? dayjs(row.doj).format("DD/MM/YYYY") : "";
                        break;

                    case "lead_names":
                        value = row.lead_names;
                        break;

                    case "gender":
                        value = row.gender === "1" ? "F" : "M";
                        break;

                    case "is_active":
                        value = row.is_active === 1 ? (
                            <CheckCircle sx={{ fontSize: 20, color: "green" }} />
                        ) : (
                            <Block sx={{ fontSize: 20, color: "lightgrey" }} />
                        );
                        break;

                    case "actions":
                        value = (
                            <div key={column.id}>
                                <Tooltip title="Make User">
                                    <span>
                                        <IconButton
                                            color="primary"
                                            disabled={row.is_user === "1"}
                                            onClick={() => {
                                                setState(prev => ({
                                                    ...prev,
                                                    openDialog: true,
                                                    selectedPeople: row.code,
                                                }));
                                            }}
                                            sx={{ padding: 0 }}
                                        >
                                            <ManageAccounts />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </div>
                        );
                        break;
                    default:
                        value = row[column.id as keyof PeopleProps];
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

                    <Grid item sm={2}>
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
                    </Grid>
                </Grid>
            </Box>
            <AppTable
                columns={columns}
                rows={state.people}
                page={state.page}
                setPage={(page) => setState(prev => ({ ...prev, page }))}
                limit={state.limit}
                setLimit={(limit) => setState(prev => ({ ...prev, limit }))}
                count={state.count}
                renderRow={renderRow}
                loading={false}
            />
            <Role
                open={state.openDialog}
                onClose={() => setState(prev => ({ ...prev, openDialog: false }))}
                onSave={saveData}
                singleSelection={true}
                selectedRoleIds={[]}
            />
        </Paper>
    );
};

export default RoleGuard(RouteGuard(List));
