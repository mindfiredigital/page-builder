import { Backdrop, CircularProgress, TableCell, TableRow, Grid, Paper, Box, Checkbox, FormControlLabel, Switch, Tooltip, IconButton } from "@mui/material";
import { DriveFileRenameOutline, PublishedWithChanges, Unpublished } from "@mui/icons-material"
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ColumnProps } from "../../../types/types";
import { paydataPeopleList, paydataPeopleUpdate } from "../../../services/services";
import { LOCAL_STORAGE, ROLE } from "../../../utils/constant";
import RouteGuard from "../../../components/RouteGuard";
import AppTable from "../../../components/AppTable";
import AppButton from "../../../components/Button";
import Search from "../../../components/Search";
import Dialog from "../../../components/Dialog";
import Add from './Add';

const List = () => {
    const [state, setState] = useState({
        paydataPeople: [] as any[],
        page: 0,
        limit: 100,
        count: 0,
        loading: false,
        openDialog: false,
        openActionDialog: false,
        showArchived: false,
        showPublished: false,
        actionTitle: "",
        actionMessage: "",
        search_key: "",
        paydataPeopleData: null as any | null
    });

    const { id } = useParams();
    const role = localStorage.getItem(LOCAL_STORAGE.ROLE_ID)
    const account = Number(role) === ROLE.ACCOUNT;
    const admin = Number(role) === ROLE.ADMIN;

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));

        const params = {
            page: state.page + 1,
            limit: state.limit,
            search_key: state.search_key,
            ...(state.showArchived ? { is_archive: 1 } : {}),
            ...(state.showPublished ? { is_published: 1 } : {})
        };

        const response = await paydataPeopleList(Number(id), params);

        if (response?.success) {
            setState(prev => ({
                ...prev,
                paydataPeople: response?.data?.paydataTransactions,
                count: response?.data?.totalCount,
                loading: false
            }));
        };

        setState(prev => ({ ...prev, loading: false }));
    }, [state.page, state.limit, state.search_key, state.showArchived, state.showPublished, id]);

    const updateArchiveAndPublished = async (row: any, type: "archive" | "published") => {
        setState(prev => ({
            ...prev,
            paydataPeople: prev.paydataPeople.map(person =>
                person.id === row.id
                    ? {
                        ...person,
                        is_published: type === "published" ? (person.is_published === 1 ? 0 : 1) : person.is_published,
                        is_archive: type === "archive" ? !person.is_archive : person.is_archive,
                    }
                    : person
            ),
            loading: true
        }));

        const payload = type === "published"
            ? { is_published: !row.is_published }
            : { is_archive: !row.is_archive };

        const response = await paydataPeopleUpdate(row.id, payload);

        if (response?.success) {
            toast.success(response.message);
        };
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
            paydataPeopleData: row,
            openDialog: true
        }));
    };

    const dialogOpen = (row: any, type: "published" | "archive") => {
        setState(prev => ({ ...prev, paydataPeopleData: row }));

        if (type === "published") {
            const actionMessage = row.is_published
                ? "Are you sure you want to unpublish this transaction?"
                : "Are you sure you want to publish this transaction?";

            const actionTitle = row.is_published ? "Unpublish Transaction" : "Publish Transaction";

            setState(prev => ({
                ...prev,
                actionMessage,
                actionTitle,
                openActionDialog: true,
            }));
        }
    };

    const actionColumn: ColumnProps[] = !account ?
        [
            { id: "is_archive", label: "Archive", width: 5, align: "center" },
            { id: "actions", label: "Actions", width: 20, align: "center" }
        ] :
        [];

    const columns: ColumnProps[] = [
        { id: "people_name", label: "People", width: 5, align: "left" },
        { id: "people_code", label: "Code", width: 5, align: "left" },
        { id: "people_lead_name", label: "Lead", width: 10, align: "left" },
        { id: "paydata_type_title", label: "Paydata Type", width: 10, align: "left" },
        { id: "currency", label: "Currency", width: 5, align: "left" },
        { id: "amount", label: "Amount", width: 5, align: "right" },
        { id: "note", label: "Note", width: 50, align: "left" },
        ...actionColumn
    ];

    const renderRow = (row: any, columns: any) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
            {columns.map((column: any) => {
                let value: any;

                switch (column.id) {
                    case "is_archive":
                        value = (
                            <Switch
                                checked={Boolean(row.is_archive)}
                                onChange={() => updateArchiveAndPublished(row, "archive")}
                                color="primary"
                            />
                        );
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
                                            disabled={row.is_published === 1}
                                            onClick={() => onRename(row)}
                                            sx={{ padding: 0, mx: 1 }}
                                        >
                                            <DriveFileRenameOutline />
                                        </IconButton>
                                    </span>
                                </Tooltip>

                                {(admin ? row.is_published === 0 : true) && (
                                    <Tooltip title="Publish">
                                        <IconButton
                                            color={admin
                                                ? "success"
                                                : row.is_published
                                                    ? "default"
                                                    : "success"
                                            }
                                            onClick={() => {
                                                if (row.is_published === 1) {
                                                    toast.success("Already Published");
                                                    return;
                                                }
                                                dialogOpen(row, "published")
                                            }}
                                            sx={{ padding: 0 }}
                                        >
                                            <PublishedWithChanges />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {row.is_published === 1 && admin && (
                                    <Tooltip title="Unpublish">
                                        <IconButton
                                            color={!row.is_archived ? "error" : "default"}
                                            onClick={() => dialogOpen(row, "published")}
                                            sx={{ padding: 0 }}
                                        >
                                            <Unpublished />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        );
                        break;

                    default:
                        value = row[column.id as keyof any];
                }

                return (
                    <TableCell
                        key={String(column.id)}
                        align={column.align || "left"}
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
                                            checked={state.showPublished}
                                            onChange={() => setState(prev => ({ ...prev, showPublished: !prev.showPublished }))}
                                            color="primary"
                                        />
                                    }
                                    label="Show Published"
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

            <Dialog
                open={state.openActionDialog}
                onClose={() => setState(prev => ({ ...prev, openActionDialog: false }))}
                title={state.actionTitle}
                description={state.actionMessage}
                onConfirm={() => state.paydataPeopleData && updateArchiveAndPublished(state.paydataPeopleData, "published")}
            />

            <AppTable
                columns={columns}
                rows={state.paydataPeople}
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
                        paydataPeopleData: null,
                    }));
                    if (refresh) fetchData();
                }}
                onSave={fetchData}
                data={state.paydataPeopleData}
            />
        </Paper>
    );
};

export default RouteGuard(List);