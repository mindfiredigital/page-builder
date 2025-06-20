import { Box, Backdrop, CircularProgress, Grid, IconButton, Paper, TableCell, TableRow, Typography, Tooltip, RadioGroup, Radio, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DriveFileRenameOutline, Note, PublishedWithChanges, Unpublished, FilterList } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AppraisalLevelProps, AppraisalPeopleAPIProps, AppraisalProps, AppraisalReasonProps, AppraisalRevisionProps, ColumnProps, LeadProps } from "../../../types/types";
import { appraisalPeopleLeadList, appraisalPeopleUpdate, appraisalRevisionList, appraisalList, appraisalPeopleList, appraisalReasonList, appraisalLevelList, appraisalRevisionUpdate, appraisalRevisionUnPublish, appraisalRevisionNote } from "../../../services/services";
import { APPRAISAL_TABLE_TYPE, LOCAL_STORAGE, ROLE, STAGE } from "../../../utils/constant";
import dayjs from "dayjs";
import RouteGuard from "../../../components/RouteGuard";
import AppTable from "../../../components/AppTable";
import Search from "../../../components/Search";
import EditAppraisalPeople from "../../../components/EditAppraisalPeople";
import Dialog from "../../../components/Dialog";
import EditRevision from "../../../components/EditRevision";
import AppraisalFilter from "../../../components/AppraisalFilter";
import RevisionNote from "../../../components/RevisionNote";

const initialFilter = {
    experience_from: 0,
    experience_to: 0,
    eligible: "",
    doj_from: "",
    doj_to: "",
    leads: []
};

const List = () => {
    const [state, setState] = useState({
        appraisal: [] as AppraisalProps[],
        level: [] as AppraisalLevelProps[],
        reason: [] as AppraisalReasonProps[],
        people: [] as any,
        lead: [] as LeadProps[],
        note: [] as { note: string; name: string }[],
        page: 0,
        limit: 100,
        count: 0,
        loading: false,
        search_key: "",
        selectedLevel: "",
        actionTitle: "",
        actionMessage: "",
        filters: initialFilter,
        columnId: "",
        direction: "",
        openPublishDialog: false,
        openUnPublishDialog: false,
        openImportDialog: false,
        openEligibleDialog: false,
        openRevisionDialog: false,
        openFilterDialog: false,
        openRevisionNoteDialog: false,
        table: localStorage.getItem(LOCAL_STORAGE.ACTIVE_TABLE) || String(APPRAISAL_TABLE_TYPE.ORIGINAL),
        peopleData: null as null | AppraisalPeopleAPIProps,
    });

    const { id } = useParams();
    const role = localStorage.getItem(LOCAL_STORAGE.ROLE_ID)
    const admin = Number(role) === ROLE.ADMIN;
    const manager = Number(role) === ROLE.MANAGER;
    const contributor = Number(role) === ROLE.CONTRIBUTOR;
    const draftCheck = state?.appraisal[0]?.appraisal_stage_id === STAGE.DRAFT;
    const noDraftCheck = state?.appraisal[0]?.appraisal_stage_id !== STAGE.DRAFT;

    const fetchData = useCallback(async () => {
        if (!id) return;

        setState(prev => ({ ...prev, loading: true }));

        const appraisal = await appraisalList(1, 1, "", [], Number(id));
        const [reason, level, lead] = await Promise.all([
            appraisalReasonList({ id: Number(id), page: 1, limit: 500, is_active: 1 }),
            appraisalLevelList({ id: Number(id), page: 1, limit: 500, is_active: 1 }),
            appraisalPeopleLeadList()
        ]);

        if (appraisal?.success && reason?.success && level?.success && lead?.success) {
            const appraisalStage = appraisal.data.appraisals[0]?.appraisal_stage_id;

            const defaultTable =
                appraisalStage !== STAGE.DRAFT
                    ? Number(localStorage.getItem(LOCAL_STORAGE.ACTIVE_TABLE)) || APPRAISAL_TABLE_TYPE.ORIGINAL
                    : APPRAISAL_TABLE_TYPE.ORIGINAL;

            localStorage.setItem(LOCAL_STORAGE.ACTIVE_TABLE, String(defaultTable));
            localStorage.setItem(LOCAL_STORAGE.ACTIVE_LEVEL, level.data.levels.length > 0 ? level.data.levels[0].id : "");

            setState(prev => ({
                ...prev,
                appraisal: appraisal.data.appraisals,
                reason: reason.data.reasons,
                level: level.data.levels,
                table: String(defaultTable),
                lead: lead.data,
                selectedLevel: level.data.levels.length > 0 ? level.data.levels[0].id : "",
                loading: false
            }));
        }
        setState(prev => ({ ...prev, loading: false }));
    }, [id]);

    const fetchOriginal = useCallback(async (is_final: boolean = false, account: boolean = false) => {
        if (!id) return;

        setState(prev => ({ ...prev, loading: true }));

        const params = {
            id: Number(id),
            page: state.page + 1,
            limit: state.limit,
            search_key: state.search_key,
            column: state.columnId,
            direction: state.direction,
            ...(account ? { account: true } : {}),
            ...(is_final ? { is_final: true } : {}),
            experience_from: state.filters?.experience_from,
            experience_to: state.filters?.experience_to,
            eligible: state.filters?.eligible,
            ...(state.filters?.doj_from ? { doj_from: state.filters?.doj_from } : {}),
            ...(state.filters?.doj_to ? { doj_to: state.filters?.doj_to } : {}),
            ...(state.filters?.leads?.length > 0 ? { leads: state.filters?.leads } : {})
        };

        const response = await appraisalPeopleList(params);

        if (response?.success) {
            setState(prev => ({
                ...prev,
                people: response.data.appraisalPeoples,
                count: response.data.totalCount,
                loading: false
            }));
        };
        setState(prev => ({ ...prev, loading: false }));
    }, [id, state.page, state.limit, state.search_key, state.filters, state.columnId, state.direction]);

    const fetchRevision = useCallback(async () => {
        if (!id) return;

        setState(prev => ({ ...prev, loading: true }));

        const params = {
            id: Number(id),
            page: state.page + 1,
            limit: state.limit,
            search_key: state.search_key,
            level_id: Number(state.selectedLevel),
            column: state.columnId,
            direction: state.direction,
            experience_from: state.filters?.experience_from,
            experience_to: state.filters?.experience_to,
            eligible: state.filters?.eligible,
            ...(state.filters?.doj_from ? { doj_from: state.filters?.doj_from } : {}),
            ...(state.filters?.doj_to ? { doj_to: state.filters?.doj_to } : {}),
            ...(state.filters?.leads?.length > 0 ? { leads: state.filters?.leads } : {})
        };

        const response = await appraisalRevisionList(params);

        if (response?.success) {
            setState(prev => ({
                ...prev,
                people: response.data.appraisalPeoples,
                count: response.data.totalCount,
                loading: false
            }));
        };
        setState(prev => ({ ...prev, loading: false }));
    }, [id, state.page, state.limit, state.search_key, state.selectedLevel, state.filters, state.columnId, state.direction]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!id) return;
            fetchData();
        }, 100);
        return () => clearTimeout(timer);
    }, [id, fetchData]);

    const fetchTableData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));

        let fetchFunction;

        switch (Number(state?.table)) {
            case APPRAISAL_TABLE_TYPE.ORIGINAL:
                fetchFunction = () => fetchOriginal();
                break;
            case APPRAISAL_TABLE_TYPE.REVISION:
                fetchFunction = () => fetchRevision();
                break;
            case APPRAISAL_TABLE_TYPE.FINAL:
                fetchFunction = () => fetchOriginal(true);
                break;
            default:
                fetchFunction = () => fetchOriginal();
        };

        await fetchFunction();
        setState(prev => ({ ...prev, loading: false }));
    }, [state.table, fetchOriginal, fetchRevision]);

    const handleUpdateAppraisal = async (data: AppraisalPeopleAPIProps) => {

        setState(prev => ({ ...prev, loading: true }));

        const payload = {
            appraisal_id: Number(id),
            code: state?.peopleData?.code,
            eligible: data?.eligible,
            ...(!data?.eligible && { ineligibility_reason_id: data?.reason }),
            ...(data?.basic && {
                basic: data?.basic,
                hra: data?.hra,
                provident_fund: data?.provident_fund,
                other_allowances: data?.other_allowances
            }),
        }

        const response = await appraisalPeopleUpdate(payload);

        if (response?.success) {
            toast.success(response.message);
            fetchOriginal();
            setState((prev) => ({
                ...prev,
                openEligibleDialog: false,
                peopleData: null,
            }));
        };
        setState(prev => ({ ...prev, loading: false }));
    };

    const updateRevision = async (payload: AppraisalRevisionProps) => {
        if (!state.peopleData?.id) return;

        setState(prev => ({ ...prev, loading: true }));

        const updatedPayload = {
            ...payload,
            appraisal_id: Number(id),
            code: state.peopleData.code,
            appraisal_revision_level_id: state.peopleData.appraisal_revision_level_id
        };

        const response = await appraisalRevisionUpdate(state.peopleData.id, updatedPayload);

        if (response?.success) {
            toast.success(response.message);
            fetchTableData();
            setState((prev) => ({
                ...prev,
                openRevisionDialog: false,
                peopleData: null,
            }));
        };

        setState(prev => ({ ...prev, loading: false }));
    };

    const updateUnpublish = async (payload: AppraisalRevisionProps) => {
        setState(prev => ({ ...prev, loading: true }));
        const response = await appraisalRevisionUnPublish(payload);

        if (response?.success) {
            toast.success(response.message);
            fetchTableData();
            setState((prev) => ({
                ...prev,
                openRevisionDialog: false,
                peopleData: null,
            }));
        };

        setState(prev => ({ ...prev, loading: false }));
    };

    const handleNote = async (id: number) => {
        setState(prev => ({ ...prev, loading: true }));
        const response = await appraisalRevisionNote(id);

        if (response?.success) {
            setState((prev) => ({
                ...prev,
                openRevisionNoteDialog: true,
                note: response.data.revisionNotes,
            }));
        };

        setState(prev => ({ ...prev, loading: false }));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTableData()
        }, 100);
        return () => clearTimeout(timer);
    }, [fetchTableData]);

    useEffect(() => {
        const handleStorageEvent = () => {
            fetchTableData();
        };

        window.addEventListener("storage", handleStorageEvent);

        return () => {
            window.removeEventListener("storage", handleStorageEvent);
        };
    }, [fetchTableData]);

    const actionColumn: ColumnProps[] = draftCheck ?
        [
            { id: "actions", label: "Actions", width: 5, align: "center" }
        ] : [];

    const pfColumn: ColumnProps[] = Number(state?.table) === APPRAISAL_TABLE_TYPE.FINAL ?
        [
            { id: "pf_number", label: "PF No", width: 6, align: "right" },
        ] : [];

    const originColumn: ColumnProps[] =
        [
            { id: "name", label: "Name", width: 7, align: "left", arrow: true },
            { id: "code", label: "Code", width: 7, align: "left", arrow: true },
            { id: "people_lead_name", label: "Lead", width: 10, align: "left" },
            { id: "experience", label: "Experience", width: 10, align: "center", arrow: true },
            { id: "doj", label: "DOJ", width: 7, align: "right", arrow: true },
            ...pfColumn,
            { id: "eligible", label: "Eligible", width: 9, align: "center", arrow: true },
            { id: "basic", label: "Basic", width: 7, align: "right", arrow: true },
            { id: "hra", label: "HRA", width: 7, align: "right", arrow: true },
            { id: "other_allowances", label: "OA", width: 7, align: "right", arrow: true },
            { id: "provident_fund", label: "PF", width: 7, align: "right", arrow: true },
            { id: "total_earnings", label: "TE", width: 7, align: "right", arrow: true },
            ...actionColumn,
        ]

    const revisionColum: ColumnProps[] =
        [
            { id: "name", label: "Name", width: 10, align: "left", arrow: true },
            { id: "code", label: "Code", width: 10, align: "left", arrow: true },
            { id: "people_lead_name", label: "Lead", width: 10, align: "left" },
            { id: "doj", label: "DOJ", width: 10, align: "right", arrow: true },
            { id: "experience", label: "Experience", width: 10, align: "center", arrow: true },
            { id: "total_earnings", label: "Curr. Sal", width: 10, align: "right", arrow: true },
            { id: "raise_amount", label: "Raise Amt.", width: 10, align: "right", arrow: true },
            { id: "new_salary", label: "New Sal", width: 10, align: "right", arrow: true },
            { id: "percent_raise", label: "Raise %", width: 10, align: "right", arrow: true },
            { id: "actions", label: "Actions", width: 10, align: "center", arrow: true },
        ];

    const columns: ColumnProps[] =
        [
            ...(Number(state?.table) === Number(APPRAISAL_TABLE_TYPE.ORIGINAL) ? originColumn : []),
            ...(Number(state?.table) === APPRAISAL_TABLE_TYPE.REVISION ? revisionColum : []),
            ...(Number(state?.table) === APPRAISAL_TABLE_TYPE.FINAL ? originColumn : []),
        ];

    const handleSearch = (search_key: string) => {
        setState(prev => ({ ...prev, search_key }));
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setState(prev => ({ ...prev, table: String(value), page: 0, search_key: "", filters: initialFilter }));
        localStorage.setItem(LOCAL_STORAGE.ACTIVE_TABLE, String(value));
        window.dispatchEvent(new Event("storage"));
    };

    const handleEligibleToggle = (row: AppraisalPeopleAPIProps) => {
        setState((prev) => ({
            ...prev,
            openEligibleDialog: true,
            peopleData: {
                ...row,
                eligible: Boolean(Number(row.eligible)),
                ...(row.show_yellow && {
                    basic: row.basic,
                    hra: row.hra,
                    other_allowances: row.other_allowances,
                    provident_fund: row.provident_fund
                }),
            },
        }));
    };

    const handleRevisionToggle = (row: AppraisalRevisionProps) => {
        setState((prev) => ({
            ...prev,
            openRevisionDialog: true,
            peopleData: row as any
        }));
    };

    const confirmDialog = (actionType: "publish" | "unpublish", row: any) => {
        if (actionType === "publish") {

            setState(prev => ({
                ...prev,
                peopleData: row,
                actionType,
                actionMessage: actionType === "publish"
                    ? `Are you sure you want to publish ${row.name}'s record?`
                    : `Are you sure you want to unpublish ${row.name}'s record? \n All revisions published after the current level will also be unpublished.`,
                actionTitle: actionType === "publish" ? "Confirm Publish" : "Confirm Unpublish",
                openPublishDialog: true,
            }));
        } else {
            setState(prev => ({
                ...prev,
                peopleData: row,
                actionType,
                actionMessage: actionType === "unpublish"
                    ? `Are you sure you want to publish ${row.name}'s record?`
                    : `Are you sure you want to unpublish ${row.name}'s record? \n All revisions published after the current level will also be unpublished.`,
                actionTitle: actionType === "unpublish" ? "Confirm Publish" : "Confirm Unpublish",
                openUnPublishDialog: true,
            }));
        }
    };

    const updatePublish = (actionType: "publish" | "unpublish") => {
        if (!state.peopleData || state.peopleData.raise_amount === undefined) return;

        if (actionType === "publish") {
            updateRevision({
                raise_amount: state.peopleData.raise_amount.toString(),
                note: state.peopleData.note,
                publish: true
            });
        };

        if (actionType === "unpublish") {
            updateUnpublish({
                appraisal_id: Number(id),
                code: state.peopleData.code,
                appraisal_revision_level_id: state.peopleData.appraisal_revision_level_id,
                id: state.peopleData.appraisal_people_id
            });
        }

        setState(prev => ({ ...prev, openConfirmationDialog: false }));
    };

    const renderOriginalRow = (row: any) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={`${row.code}-${row.name}`}>
            {originColumn.map((column: any) => renderCell(row, column))}
        </TableRow>
    );

    const renderRevisionRow = (row: any) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={`${row.id}-${row.code}`}>
            {revisionColum.map((column: any) => renderCell(row, column))}
        </TableRow>
    );

    const renderFinalRow = (row: any) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={`${row.code}-${row.name}`}>
            {originColumn.map((column: any) => renderCell(row, column))}
        </TableRow>
    );

    const renderCell = (row: any, column: any) => {
        let value: any;

        const isRevisionTable = Number(state?.table) === APPRAISAL_TABLE_TYPE.REVISION;
        const isFinalTable = Number(state?.table) === APPRAISAL_TABLE_TYPE.FINAL;
        const isEligible = row.eligible;
        const isFinal = row.is_final;

        switch (column.id) {
            case "doj":
                value = row.doj ? dayjs(row.doj).format("DD/MM/YYYY") : "";
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

            case "eligible":
                if ("eligible" in row) {
                    value = row.eligible ? "Yes" : "No";
                }
                break;

            case "percent_raise":
                value = row[column.id]?.toFixed(2);
                break;

            case "actions":
                if (isRevisionTable && !isEligible) {
                    return (
                        <TableCell
                            key={String(column.id)}
                            align={column.align}
                            style={{
                                width: `${column.width}%`,
                                maxWidth: `${column.width}%`,
                                backgroundColor: row.show_grey && !isEligible ? "#E0E0E0" : "#FFEBEE",
                            }}
                        />
                    );
                }

                if (draftCheck && Number(state?.table) === Number(APPRAISAL_TABLE_TYPE.ORIGINAL)) {
                    value = (
                        <Box>
                            <Tooltip title="Edit">
                                <IconButton color="primary" onClick={() => handleEligibleToggle(row)} sx={{ padding: 0 }}>
                                    <DriveFileRenameOutline />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    );
                }

                if (noDraftCheck) {
                    value = (
                        <Box>
                            <Tooltip title="Edit">
                                <span>
                                    <IconButton
                                        color="primary"
                                        disabled={row.is_published === 1}
                                        onClick={() => handleRevisionToggle(row)}
                                        sx={{ padding: 0, mx: 1 }}
                                    >
                                        <DriveFileRenameOutline />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            {(admin ? row.is_published === 0 : true) && (
                                <Tooltip title="Publish">
                                    <IconButton
                                        sx={{ padding: 0 }}
                                        color={admin ? "success" : row.is_published ? "default" : "success"}
                                        onClick={() => {
                                            if (row.is_published === 1) {
                                                toast.success("Already Published");
                                                return;
                                            }
                                            confirmDialog("publish", row);
                                        }}
                                    >
                                        <PublishedWithChanges />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {row.is_published === 1 && admin && (
                                <Tooltip title="Unpublish">
                                    <IconButton
                                        sx={{ padding: 0 }}
                                        color={!row.is_archived ? "error" : "default"}
                                        onClick={() => confirmDialog("unpublish", row)}
                                    >
                                        <Unpublished />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {row.note && (
                                <Tooltip title="View Note">
                                    <IconButton color="info" onClick={() => handleNote(row.id)} sx={{ padding: 0, mx: 1 }}>
                                        <Note />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    );
                }
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
                    fontWeight: row.show_grey ? "bold" : "normal",
                    backgroundColor: row.show_grey
                        ? "#E0E0E0" // Light Grey when show_grey is true
                        : isFinalTable
                            ? isEligible && isFinal
                                ? "#C8E6C9" // Light Green (Eligible and Final)
                                : !isEligible && !isFinal
                                    ? "#FFEBEE" // Light Red (Not Eligible and Not Final)
                                    : "inherit" // No change for Eligible but not Final
                            : isRevisionTable && !isEligible && !row.show_grey
                                ? "#FFEBEE" // Light Red if it's a revision table and not eligible
                                : row.show_yellow
                                    ? "#FFF9C4" // Light Yellow if show_yellow is true
                                    : "inherit",
                }}
            >
                {value}
            </TableCell>
        );
    };

    const renderRow = (row: any) => {
        switch (Number(state?.table)) {
            case Number(APPRAISAL_TABLE_TYPE.ORIGINAL):
                return renderOriginalRow(row);
            case APPRAISAL_TABLE_TYPE.REVISION:
                return renderRevisionRow(row);
            case APPRAISAL_TABLE_TYPE.FINAL:
                return renderFinalRow(row);
            default:
                return null;
        }
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
                    {(admin || manager || contributor) && noDraftCheck && (
                        <Grid item xs={12}>
                            <RadioGroup row value={state.table} onChange={handleRadioChange}>
                                {(admin || manager) && (
                                    <FormControlLabel
                                        value={APPRAISAL_TABLE_TYPE.ORIGINAL}
                                        control={<Radio color="primary" />}
                                        label="Original"
                                    />
                                )}
                                <FormControlLabel
                                    value={APPRAISAL_TABLE_TYPE.REVISION}
                                    control={<Radio color="primary" />}
                                    label="Revision"
                                />
                                <FormControl disabled={state.table !== String(APPRAISAL_TABLE_TYPE.REVISION) || state.loading}>
                                    <InputLabel>Level</InputLabel>
                                    <Select
                                        labelId="level-select-label"
                                        label="Level"
                                        variant="outlined"
                                        name="level"
                                        size="small"
                                        value={state.selectedLevel}
                                        sx={{ minWidth: 120 }}
                                        onChange={(event) => {
                                            const selectedLevel = event.target.value;
                                            localStorage.setItem(LOCAL_STORAGE.ACTIVE_LEVEL, selectedLevel);
                                            setState(prev => ({ ...prev, selectedLevel }));
                                        }}
                                    >
                                        {state?.level?.length > 0 ? (
                                            state.level.map((level) => (
                                                <MenuItem key={level.id} value={level.id}>
                                                    {level.title}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No active levels available</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                {(admin || manager) && (
                                    <FormControlLabel
                                        value={APPRAISAL_TABLE_TYPE.FINAL}
                                        control={<Radio color="primary" />}
                                        label="Final"
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </RadioGroup>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={1} sx={{ width: "100%" }}>

                            <Grid item sx={{ flexGrow: 1 }}>
                                <Search onSearch={handleSearch} />
                            </Grid>

                            <Grid item sx={{ display: "flex", alignItems: "center" }}>
                                <Tooltip title="Additional Filters">
                                    <IconButton onClick={() => setState(prev => ({ ...prev, openFilterDialog: true }))}>
                                        <FilterList />
                                    </IconButton>
                                </Tooltip>
                                <Typography>
                                    Additional Filters
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            <AppraisalFilter
                open={state.openFilterDialog}
                onClose={() => setState(prev => ({ ...prev, openFilterDialog: false }))}
                lead={state.lead}
                onSave={(data) => {
                    setState(prev => ({
                        ...prev,
                        filters: {
                            experience_from: data.experience_from,
                            experience_to: data.experience_to,
                            doj_from: data.doj_from,
                            doj_to: data.doj_to,
                            leads: data.leads,
                            eligible: data.eligible
                        }
                    }));
                }}
            />

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
                onSort={(columnId, direction) => {
                    setState(prev => ({ ...prev, columnId: columnId, direction: direction }))
                }}
            />

            <Dialog
                open={state.openPublishDialog}
                onClose={() => setState(prev => ({ ...prev, openPublishDialog: false }))}
                title={state.actionTitle}
                description={state.actionMessage}
                onConfirm={() => updatePublish("publish")}
            />

            <Dialog
                open={state.openUnPublishDialog}
                onClose={() => setState(prev => ({ ...prev, openUnPublishDialog: false }))}
                title={state.actionTitle}
                description={state.actionMessage}
                onConfirm={() => updatePublish("unpublish")}
            />

            <EditAppraisalPeople
                open={state.openEligibleDialog}
                currentValue={state.peopleData?.eligible || false}
                onClose={() => setState((prev) => ({ ...prev, openEligibleDialog: false, peopleData: null }))}
                onSave={(data) => handleUpdateAppraisal(data)}
                toggleValue={() =>
                    setState((prev) => ({
                        ...prev,
                        peopleData: {
                            ...prev.peopleData,
                            eligible: !prev.peopleData?.eligible
                        },
                    }))
                }
                reason={state.reason}
                peopleData={state.peopleData}
                loading={state.loading}
            />

            <EditRevision
                open={state.openRevisionDialog}
                onClose={() => setState((prev) => ({ ...prev, openRevisionDialog: false, peopleData: null }))}
                id={state?.peopleData?.id ?? 0}
                note={state?.peopleData?.note ?? ""}
                raise_amount={state?.peopleData?.raise_amount ?? 0}
                name={state?.peopleData?.name}
                onSave={updateRevision}
                loading={state.loading}
            />

            <RevisionNote
                open={state.openRevisionNoteDialog}
                onClose={() => setState((prev) => ({ ...prev, openRevisionNoteDialog: false }))}
                notes={state.note}
            />
        </Paper>
    );
};

export default RouteGuard(List);
