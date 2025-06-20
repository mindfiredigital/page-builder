import { useEffect, useState, useCallback } from "react";
import { Backdrop, CircularProgress, IconButton, Box, Tooltip } from "@mui/material";
import { LockOpenOutlined, DeleteOutlineOutlined, LockOutlined, LockPersonOutlined, PublishedWithChangesOutlined, CloudDownloadOutlined, CloudUploadOutlined } from "@mui/icons-material";
import { appraisalPeopleList, appraisalPeopleFinalCSV, appraisalReasonList, appraisalPeopleCSV, paydataUpdate, paydataList, appraisalList, appraisalUpdate, appraisalLevelList, appraisalRevisionCreate, paydataPeopleList, appraisalRevisionPublishAll, userList } from "../services/services";
import { toast } from "sonner";
import { useParams, useLocation } from "react-router-dom";
import { AppraisalReasonProps, AppraisalPeopleAPIProps, PaydataProps, AppraisalProps, AppraisalLevelProps, UserProps } from "../types/types";
import { APPRAISAL_REVISION, APPRAISAL_TABLE_TYPE, LOCAL_STORAGE, ROLE, ROUTE, STAGE } from "../utils/constant";
import Dialog from "./Dialog";
import ImportSalary from "./ImportSalary";

const Status = () => {
    const [state, setState] = useState({
        dialogOpen: false,
        dialogMessage: {
            title: "",
            description: "",
            confirmAction: () => { },
        },
        openImportDialog: false,
        loading: false,
        level: [] as AppraisalLevelProps[],
        reason: [] as AppraisalReasonProps[],
        appraisal: [] as AppraisalProps[],
        data: ([] as Array<PaydataProps | AppraisalProps>),
        user: [] as UserProps[]
    });

    const { id } = useParams();
    const location = useLocation();

    const paydata = location.pathname.includes(`${ROUTE.PAYDATA}/${id}${ROUTE.TRANSACTION}`);
    const appraisal = location.pathname.includes(`${ROUTE.APPRAISAL}/${id}${ROUTE.PEOPLE}`);
    const activeTab = localStorage.getItem(LOCAL_STORAGE.ACTIVE_TABLE);

    const userId = localStorage.getItem(LOCAL_STORAGE.USER_ID);
    const role = localStorage.getItem(LOCAL_STORAGE.ROLE_ID);
    const roleCheck = Number(role) === ROLE.ADMIN;
    const draftCheck = state?.data[0]?.appraisal_stage_id === STAGE.DRAFT;
    const account = Number(role) === ROLE.ACCOUNT;
    const manager = Number(role) === ROLE.MANAGER;
    const contributor = Number(role) === ROLE.CONTRIBUTOR;

    const fetchData = useCallback(async () => {
        if (!id) return;

        setState(prev => ({ ...prev, loading: true }));

        let reason: any, level: any;
        if (!account && !manager && !contributor) {
            [reason, level] = await Promise.all([
                appraisalReasonList({ id: Number(id), page: 1, limit: 500, is_active: 1 }),
                appraisalLevelList({ id: Number(id), page: 1, limit: 1, is_active: 1 })
            ]);
        };

        const response = paydata
            ? await paydataList(1, 1, "", [], Number(id))
            : await appraisalList(1, 1, "", [], Number(id));

        if (reason?.success && level?.success) {
            setState(prev => ({
                ...prev,
                reason: reason.data.reasons,
                level: level.data.levels,
                data: paydata ? [response?.data?.paydatas[0]] : [response?.data?.appraisals[0]],
                loading: false
            }));
        }
        setState(prev => ({ ...prev, loading: false }));
    }, [id, paydata, account, contributor, manager]);

    const fetchUser = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));

        const params = {
            page: 1,
            limit: 1,
            id: Number(userId)
        };

        const response = await userList(params);
        if (response?.success) {
            setState(prev => ({
                ...prev,
                user: response?.data?.users,
                loading: false
            }));
        };

        setState(prev => ({ ...prev, loading: false }));
    }, [userId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (id) {
                fetchData();
                fetchUser();
            };
        }, 100);
        return () => clearTimeout(timer);
    }, [id, appraisal, fetchData, fetchUser, userId]);

    const handleStageChange = async (stage_id: number) => {
        if (!state.data[0]?.id) {
            toast.error("Invalid ID");
            return;
        };

        if (appraisal && stage_id === STAGE.OPEN) {
            if (!state.level || state.level.length === 0) {
                toast.error("No Active levels found for this appraisal. Please create levels first.");
                return;
            };

            setState((prev) => ({ ...prev, loading: true }));
            const response = await appraisalRevisionCreate({ appraisal_id: Number(id), note: APPRAISAL_REVISION.NOTE });
            if (!response?.success) {
                setState((prev) => ({ ...prev, loading: false }));
                return;
            };
        };

        const payload: any = {
            appraisal_stage_id: stage_id
        };

        if (stage_id === STAGE.DRAFT) {
            payload.appraisal_id = Number(id);
            payload.draft = true;
        };

        const response = paydata
            ? await paydataUpdate(Number(id), { paydata_stage_id: stage_id })
            : await appraisalUpdate(Number(id), payload);

        if (response?.success) {
            toast.success(response.message);
            window.location.reload();
        }
        setState((prev) => ({ ...prev, loading: false }));
    };

    const importSalaryCSV = async (payload: AppraisalPeopleAPIProps) => {
        if (!payload || !payload.file) {
            toast.error("Please select CSV file to upload");
            return;
        };

        setState(prev => ({ ...prev, loading: true }));

        const response = await appraisalPeopleCSV(payload?.file, payload);
        if (response?.success) {
            toast.success(response.message);
            window.location.reload();
        };
        setState(prev => ({ ...prev, loading: false }));
    };

    const uploadCSV = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const file: File | undefined = fileInput.files?.[0];
        if (!file) {
            toast.error("Please select CSV file to upload");
            return;
        };

        if (!id) {
            toast.error("Invalid request");
            return;
        };

        setState(prev => ({ ...prev, loading: true }));

        const response = await appraisalPeopleFinalCSV(file, id);
        if (response?.success) {
            toast.success(response.message, { duration: 4000 });
            window.location.reload();
        };
        setState(prev => ({ ...prev, loading: false }));
        fileInput.value = "";
    }, [id]);

    const exportCSV = useCallback(async () => {
        const params = { id: Number(id), page: 1, limit: 1000, search_key: "", account: true, is_final: true };

        setState(prev => ({ ...prev, loading: true }));

        const response = appraisal ?
            await appraisalPeopleList(params) :
            await paydataPeopleList(Number(id), params);

        if (response) {
            const url = window.URL.createObjectURL(response);
            // Trigger download
            const link = document.createElement("a");
            link.href = url;
            link.download = appraisal ? "Appraisal People.xlsx" : "Paydata Transactions.xlsx"
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('CSV Export successfully');
        }
        setState(prev => ({ ...prev, loading: false }));
    }, [id, appraisal]);

    const publishAll = async () => {
        const level = localStorage.getItem(LOCAL_STORAGE.ACTIVE_LEVEL)

        if (!level) return;

        setState(prev => ({ ...prev, loading: true }));

        const response = await appraisalRevisionPublishAll({ appraisal_id: Number(id), appraisal_revision_level_id: Number(level) });
        if (response?.success) {
            toast.success(response.message);
            window.location.reload();
        };
        setState(prev => ({ ...prev, loading: false }));
    };

    const openConfirmationDialog = (title: string, description: string, confirmAction: () => void) => {
        setState((prev) => ({
            ...prev,
            dialogOpen: true,
            dialogMessage: { title, description, confirmAction },
        }));
    };

    const stageActions: Record<number, React.ReactNode> = {
        1: (
            <Box display="flex" gap={2}>
                {appraisal && state.user[0]?.permissions?.appraisal_open && (
                    <Tooltip title="Open Contributions">
                        <IconButton
                            onClick={() =>
                                openConfirmationDialog(
                                    "Confirm Stage Change",
                                    "Move to Open Contributions?",
                                    () => handleStageChange(STAGE.OPEN)
                                )
                            }
                            sx={{
                                color: "#fff",
                                background: "#15803d",
                                "&:hover": { background: "#15803dCC" }
                            }}
                        >
                            <LockOpenOutlined />
                        </IconButton>
                    </Tooltip>
                )}
    
                {paydata && state.user[0]?.permissions?.paydata_open && (
                    <Tooltip title="Open Contributions">
                        <IconButton
                            onClick={() =>
                                openConfirmationDialog(
                                    "Confirm Stage Change",
                                    "Move to Open Contributions?",
                                    () => handleStageChange(STAGE.OPEN)
                                )
                            }
                            sx={{
                                color: "#fff",
                                background: "#15803d",
                                "&:hover": { background: "#15803dCC" }
                            }}
                        >
                            <LockOpenOutlined />
                        </IconButton>
                    </Tooltip>
                )}
    
                {appraisal && state.user[0]?.permissions?.appraisal_archived && (
                    <Tooltip title="Move to Archive">
                        <IconButton
                            onClick={() =>
                                openConfirmationDialog(
                                    "Confirm Stage Change",
                                    "Move to Archive?",
                                    () => handleStageChange(STAGE.ARCHIVED)
                                )
                            }
                            sx={{
                                color: "#fff",
                                background: "#b91c1c",
                                "&:hover": { background: "#b91c1cCC" }
                            }}
                        >
                            <DeleteOutlineOutlined />
                        </IconButton>
                    </Tooltip>
                )}
    
                {paydata && state.user[0]?.permissions?.paydata_archived && (
                    <Tooltip title="Move to Archive">
                        <IconButton
                            onClick={() =>
                                openConfirmationDialog(
                                    "Confirm Stage Change",
                                    "Move to Archive?",
                                    () => handleStageChange(STAGE.ARCHIVED)
                                )
                            }
                            sx={{
                                color: "#fff",
                                background: "#b91c1c",
                                "&:hover": { background: "#b91c1cCC" }
                            }}
                        >
                            <DeleteOutlineOutlined />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        ),
        2: (
            <Box display="flex" gap={2}>
                {appraisal && state.user[0]?.permissions?.appraisal_closed && (
                    <Tooltip title="Close Contributions">
                        <IconButton
                            onClick={() =>
                                openConfirmationDialog(
                                    "Confirm Stage Change",
                                    "Close Contributions?",
                                    () => handleStageChange(STAGE.CLOSED)
                                )
                            }
                            sx={{
                                color: "#fff",
                                background: "#6b21a8",
                                "&:hover": { background: "#6b21a8CC" }
                            }}
                        >
                            <LockOutlined />
                        </IconButton>
                    </Tooltip>
                )}
    
                {paydata && state.user[0]?.permissions?.paydata_closed && (
                    <Tooltip title="Close Contributions">
                        <IconButton
                            onClick={() =>
                                openConfirmationDialog(
                                    "Confirm Stage Change",
                                    "Close Contributions?",
                                    () => handleStageChange(STAGE.CLOSED)
                                )
                            }
                            sx={{
                                color: "#fff",
                                background: "#6b21a8",
                                "&:hover": { background: "#6b21a8CC" }
                            }}
                        >
                            <LockOutlined />
                        </IconButton>
                    </Tooltip>
                )}
    
                {appraisal && state.user[0]?.permissions?.appraisal_draft && (
                    <Tooltip title="Revert to Draft">
                        <IconButton
                            onClick={() =>
                                openConfirmationDialog(
                                    "Confirm Stage Change",
                                    "Revert to Draft?",
                                    () => handleStageChange(STAGE.DRAFT)
                                )
                            }
                            sx={{
                                color: "#fff",
                                background: "#fbbf24",
                                "&:hover": { background: "#fbbf24CC" }
                            }}
                        >
                            <LockPersonOutlined />
                        </IconButton>
                    </Tooltip>
                )}
    
                {paydata && state.user[0]?.permissions?.paydata_draft && (
                    <Tooltip title="Revert to Draft">
                        <IconButton
                            onClick={() =>
                                openConfirmationDialog(
                                    "Confirm Stage Change",
                                    "Revert to Draft?",
                                    () => handleStageChange(STAGE.DRAFT)
                                )
                            }
                            sx={{
                                color: "#fff",
                                background: "#fbbf24",
                                "&:hover": { background: "#fbbf24CC" }
                            }}
                        >
                            <LockPersonOutlined />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        ),
        3: (
            <Box display="flex" gap={2}>
                {appraisal && state.user[0]?.permissions?.appraisal_open && (
                    <Tooltip title="Open Contributions">
                        <IconButton
                            onClick={() =>
                                openConfirmationDialog(
                                    "Confirm Stage Change",
                                    "Move to Open Contributions?",
                                    () => handleStageChange(STAGE.OPEN)
                                )
                            }
                            sx={{
                                color: "#fff",
                                background: "#15803d",
                                "&:hover": { background: "#15803dCC" }
                            }}
                        >
                            <LockOpenOutlined />
                        </IconButton>
                    </Tooltip>
                )}
    
                {paydata && state.user[0]?.permissions?.paydata_open && (
                    <Tooltip title="Open Contributions">
                        <IconButton
                            onClick={() =>
                                openConfirmationDialog(
                                    "Confirm Stage Change",
                                    "Move to Open Contributions?",
                                    () => handleStageChange(STAGE.OPEN)
                                )
                            }
                            sx={{
                                color: "#fff",
                                background: "#15803d",
                                "&:hover": { background: "#15803dCC" }
                            }}
                        >
                            <LockOpenOutlined />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        ),
        4: (
            <Box display="flex" gap={2}>
                {appraisal && state.user[0]?.permissions?.appraisal_open && (
                    <Tooltip title="Open Contributions">
                        <IconButton
                            onClick={() =>
                                openConfirmationDialog(
                                    "Confirm Stage Change",
                                    "Move to Open Contributions?",
                                    () => handleStageChange(STAGE.OPEN)
                                )
                            }
                            sx={{
                                color: "#fff",
                                background: "#15803d",
                                "&:hover": { background: "#15803dCC" }
                            }}
                        >
                            <LockOpenOutlined />
                        </IconButton>
                    </Tooltip>
                )}
    
                {paydata && state.user[0]?.permissions?.paydata_open && (
                    <Tooltip title="Open Contributions">
                        <IconButton
                            onClick={() =>
                                openConfirmationDialog(
                                    "Confirm Stage Change",
                                    "Move to Open Contributions?",
                                    () => handleStageChange(STAGE.OPEN)
                                )
                            }
                            sx={{
                                color: "#fff",
                                background: "#15803d",
                                "&:hover": { background: "#15803dCC" }
                            }}
                        >
                            <LockOpenOutlined />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        )
    };

    return (
        <>
            <Backdrop
                open={state.loading}
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {appraisal && Number(activeTab) === APPRAISAL_TABLE_TYPE.REVISION &&
                <Box display="flex" flexDirection="column" gap={2}>
                    <Tooltip title="Publish All">
                        <IconButton onClick={() => openConfirmationDialog("Confirm Published All", "Do you want to publish all the records? Please confirm.", () => publishAll())} sx={{ color: "#fff", background: "#424242", "&:hover": { background: "#424242CC" } }}>
                            <PublishedWithChangesOutlined />
                        </IconButton>
                    </Tooltip>
                </Box>
            }

            {state.user.length > 0 && state.user[0].permissions?.appraisal_export && (Number(activeTab) === APPRAISAL_TABLE_TYPE.FINAL || account) &&
                <Box display="flex" flexDirection="column" gap={2}>
                    <Tooltip title="Export">
                        <IconButton
                            onClick={exportCSV}
                            sx={{ color: "#fff", background: "#4527A0", "&:hover": { background: "#311B92" } }}>
                            <CloudDownloadOutlined />
                        </IconButton>
                    </Tooltip>
                </Box>
            }

            {state.user.length > 0 && state.user[0].permissions?.appraisal_import && appraisal && (Number(activeTab) === APPRAISAL_TABLE_TYPE.FINAL || account) &&
                <Box display="flex" flexDirection="column" gap={2}>
                    <Tooltip title="Import">
                        <IconButton
                            onClick={() => document.getElementById("csvFileInput")?.click()}
                            sx={{ color: "#fff", background: "#26A69A", "&:hover": { background: "#00796B" } }}
                        >
                            <CloudUploadOutlined />
                        </IconButton>
                    </Tooltip>
                </Box>
            }

            {state.user.length > 0 && state.user[0].permissions?.appraisal_import_salary && roleCheck && draftCheck &&
                <Box display="flex" flexDirection="column" gap={2}>
                    <Tooltip title="Import Salary">
                        <IconButton onClick={() => setState(prev => ({ ...prev, openImportDialog: true }))} sx={{ color: "#fff", background: "#26A69A", "&:hover": { background: "#00796B" } }}>
                            <CloudUploadOutlined />
                        </IconButton>
                    </Tooltip>
                </Box>
            }

            {Number(role) === ROLE.ADMIN &&
                <Box display="flex" alignItems="center" gap={2}>
                    {paydata
                        ? ("paydata_stage_id" in (state.data?.[0] || {}))
                            ? stageActions[(state.data[0] as PaydataProps)?.paydata_stage_id]
                            : null
                        : ("appraisal_stage_id" in (state.data?.[0] || {}))
                            ? stageActions[(state.data[0] as AppraisalProps)?.appraisal_stage_id]
                            : null
                    }
                </Box>
            }

            <input
                type="file"
                id="csvFileInput"
                accept=".csv"
                style={{ display: "none" }}
                onChange={(event) => uploadCSV(event)}
            />

            <Dialog
                open={state.dialogOpen}
                onClose={() => setState((prev) => ({ ...prev, dialogOpen: false }))}
                title={state.dialogMessage.title}
                description={state.dialogMessage.description}
                onConfirm={() => {
                    state.dialogMessage.confirmAction();
                    setState((prev) => ({ ...prev, dialogOpen: false }));
                }}
                onCancel={() => setState((prev) => ({ ...prev, dialogOpen: false }))}
            />

            <ImportSalary
                open={state.openImportDialog}
                onClose={() => setState(prev => ({ ...prev, openImportDialog: false }))}
                onSave={importSalaryCSV}
                reasons={state.reason}
            />
        </>
    );
};

export default Status;
