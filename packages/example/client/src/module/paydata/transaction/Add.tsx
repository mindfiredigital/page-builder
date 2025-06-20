import { useState, useEffect, useCallback } from "react";
import { FormControlLabel, Checkbox, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { paydataPeopleCodeList, paydataPeopleTypeList, paydataPeopleCreate, paydataPeopleUpdate } from "../../../services/services";
import { AddPaydataPeopleProps, months } from "../../../types/types";
import { LOCAL_STORAGE, ROLE } from "../../../utils/constant";

const Add = ({ open, onClose, onSave, data }: AddPaydataPeopleProps) => {
    const now = new Date();
    const { id } = useParams();
    const [formData, setFormData] = useState([
        {
            paydata_id: Number(id),
            paydata_type_id: "",
            paydata_checkbox: false,
            people_code: "",
            currency: "INR",
            amount: "",
            note: "",
            start_year: now.getFullYear(),
            start_month: (now.getMonth() + 1),
            repeat_month_frequency: "",
            paydata_schedule_type: "",
            run_until_year: "",
            run_until_month: "",
            run_until_occurance: "",
            is_published: false
        }
    ]);
    const [currentFormIndex, setCurrentFormIndex] = useState(0);
    const [hasChildren, setHasChildren] = useState(false);
    const [showParent, setShowParent] = useState(true);
    const [paydataType, setPaydatatype] = useState<{
        [x: string]: any; id: number; childId: any[]; title: string
    }[]>([]);
    const [peopleCode, setPeopleCode] = useState<{ code: string; name: string }[]>([]);
    const [parent, setParent] = useState(false);

    const role = localStorage.getItem(LOCAL_STORAGE.ROLE_ID);
    const account = Number(role) === ROLE.ACCOUNT

    const fetchData = useCallback(async () => {
        let peopleCode: any, paydataType: any;
        if (!account) {
            [peopleCode, paydataType] = await Promise.all([
                paydataPeopleCodeList(),
                paydataPeopleTypeList()
            ]);
        }

        if (peopleCode?.success && paydataType?.success) {
            setPaydatatype(paydataType.data || []);
            setPeopleCode(peopleCode.data || []);
        };
    }, [account]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 100);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleChange = (index: number, field: keyof any, value: any) => {
        if (field === "paydata_type_id") {
            const selectedType = paydataType.find((type) => type.id === value);
            setHasChildren((selectedType?.childId?.length ?? 0) > 0);
            const isParent = !!(selectedType?.childId && selectedType.childId.length);
            setParent(isParent);
            const updatedForms = [...formData];
            updatedForms[index] = {
                ...updatedForms[index],
                [field]: value,
                paydata_checkbox: isParent,
            };
            setFormData(updatedForms);
        } else {
            const updatedForms = [...formData];
            updatedForms[index] = {
                ...updatedForms[index],
                [field]: value,
            };
            setFormData(updatedForms);
        }
    };

    useEffect(() => {
        if (open && data) {
            const now = new Date();
            setFormData([
                {
                    paydata_id: Number(id),
                    paydata_type_id: String(data.paydata_type_id),
                    paydata_checkbox: false,
                    people_code: data.people_code,
                    currency: String(data.currency),
                    amount: String(data.amount),
                    note: data.note,
                    start_year: now.getFullYear(),
                    start_month: now.getMonth() + 1,
                    repeat_month_frequency: String(data.repeat_month_frequency),
                    paydata_schedule_type: String(data.paydata_schedule_type),
                    run_until_year: String(data.run_until_year),
                    run_until_month: String(data.run_until_month),
                    run_until_occurance: String(data.run_until_occurance),
                    is_published: false
                }
            ]);
        }
    }, [open, data, id]);

    const handleNextForm = () => {
        const currentForm = formData[currentFormIndex];

        if (currentForm?.paydata_type_id === "" || currentForm?.people_code === "") {
            toast.error("Please fill in all required fields.");
            return;
        }

        const selectedType = paydataType.find((type) => type.id === Number(currentForm?.paydata_type_id));

        setHasChildren(selectedType?.childId ? selectedType.childId.length > 0 : false);
        setShowParent(false);

        if (currentFormIndex + 1 === formData.length) {
            const childPaydataTypeOption = paydataType.find(
                (type) => type.id === Number(currentForm?.paydata_type_id)
            );

            // Ensure childPaydataTypeOption and childId exist before accessing it
            if (childPaydataTypeOption?.childId && childPaydataTypeOption.childId.length > 0) {
                const newFormData = {
                    paydata_id: Number(id),
                    paydata_type_id: childPaydataTypeOption.childId[0],
                    paydata_checkbox: true,
                    people_code: "",
                    currency: "",
                    amount: "",
                    note: "",
                    start_year: now.getFullYear(),
                    start_month: (now.getMonth() + 1),
                    repeat_month_frequency: "",
                    paydata_schedule_type: "",
                    run_until_year: "",
                    run_until_month: "",
                    run_until_occurance: "",
                    is_published: false
                };
                setFormData([...formData, newFormData]);
            }
        }

        setCurrentFormIndex(currentFormIndex + 1);
    };

    const handlePreviousForm = () => {
        if (currentFormIndex > 0) {
            setCurrentFormIndex(currentFormIndex - 1);
            setShowParent(true);
        }
    };

    const excludeChildrenFromDropdown = (paydataTypeList: any[]) => paydataTypeList.filter(
        (type) => !paydataTypeList.some((parent) => parent.childId?.includes(type.id))
    );

    const handleSave = async () => {
        if (data) {
            const response = await paydataPeopleUpdate(data.id, formData);
            if (response?.success) {
                toast.success(response?.message);
                onSave();
                handleClose();
            }
        } else {
            const response = await paydataPeopleCreate(formData);
            if (response?.success) {
                toast.success(response?.message);
                onSave();
                handleClose();
            }
        }
    };

    const handleScheduleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedPaydataType = paydataType.find(
            (type) => type.id === Number(formData[currentFormIndex]?.paydata_type_id)
        );

        if (selectedPaydataType?.is_recurring === "No") {
            toast.error("This paydata type is not recurring and cannot be scheduled.");
            return;
        };

        const isChecked = e.target.checked;
        setFormData((prevFormData) =>
            prevFormData.map((data, index) => ({
                ...data,
                paydata_checkbox: index === 0 ? isChecked : data.paydata_checkbox,
            }))
        );
    };

    const handleClose = () => {
        setFormData([
            {
                paydata_id: Number(id),
                paydata_type_id: "",
                paydata_checkbox: false,
                people_code: "",
                currency: "INR",
                amount: "",
                note: "",
                start_year: now.getFullYear(),
                start_month: now.getMonth() + 1,
                repeat_month_frequency: "",
                paydata_schedule_type: "",
                run_until_year: "",
                run_until_month: "",
                run_until_occurance: "",
                is_published: false
            }
        ]);

        onClose(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="xs">
            <DialogTitle>{data ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
            <DialogContent>
                <Grid mt={2}>
                    <FormControl fullWidth>
                        <InputLabel id="paydata-type-title">Paydata Type</InputLabel>
                        <Select
                            labelId="paydata-type-title"
                            label="Paydata Type"
                            value={formData[currentFormIndex]?.paydata_type_id}
                            onChange={(e) => handleChange(currentFormIndex, "paydata_type_id", Number(e.target.value))}
                            variant="outlined"
                            sx={{ mb: 2 }}
                        >
                            {!data && hasChildren && !showParent &&
                                paydataType
                                    .filter((type) => {
                                        const isChild = type.id === Number(formData[currentFormIndex]?.paydata_type_id);
                                        return isChild;
                                    })
                                    .map((type) => {
                                        return (
                                            <MenuItem key={type.id} value={type.id}>
                                                {type.title}
                                            </MenuItem>
                                        );
                                    })}

                            {!data && showParent &&
                                excludeChildrenFromDropdown(paydataType).map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.title}
                                    </MenuItem>
                                ))}

                            {data && paydataType.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Autocomplete
                    options={peopleCode}
                    getOptionLabel={(option) => option.name}

                    value={
                        peopleCode.find(
                            (person) => person.code === formData[currentFormIndex]?.people_code
                        ) || null
                    }

                    onChange={(event, newValue) => {
                        if (currentFormIndex === 1) {
                            handleChange(currentFormIndex, "people_code", "");
                        }
                        handleChange(
                            currentFormIndex,
                            "people_code",
                            newValue?.code || ""
                        );
                    }}

                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search People"
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />

                <Grid mt={2}>
                    <FormControl fullWidth>
                        <InputLabel id="currency">Currency</InputLabel>
                        <Select
                            labelId="currency"
                            label="Currency"
                            value={formData[currentFormIndex]?.currency || ""}
                            onChange={(e) =>
                                handleChange(currentFormIndex, "currency", e.target.value)
                            }
                        >
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="EUR">EUR</MenuItem>
                            <MenuItem value="CAD">CAD</MenuItem>
                            <MenuItem value="AUD">AUD</MenuItem>
                            <MenuItem value="GBP">GBP</MenuItem>
                            <MenuItem value="INR">INR</MenuItem>
                            <MenuItem value="NZD">NZD</MenuItem>
                            <MenuItem value="SGD">SGD</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Amount"
                    value={formData[currentFormIndex]?.amount || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        const cleanedValue = value.replace(/^0+(?=\d)/, '');
                        handleChange(currentFormIndex, "amount", cleanedValue === "" ? "" : Number(cleanedValue));
                    }}
                    type="number"
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Note"
                    value={formData[currentFormIndex]?.note}
                    onChange={(e) => handleChange(currentFormIndex, "note", e.target.value)}
                    multiline
                    rows={4}
                />

                {formData[currentFormIndex]?.paydata_checkbox && (
                    <>
                        <Grid mt={1}>
                            <FormControl fullWidth>
                                <InputLabel id="repeat_month_frequency">Repeat Month Frequency</InputLabel>
                                <Select
                                    labelId="repeat_month_frequency"
                                    label="Repeat Month Frequency"
                                    value={formData[currentFormIndex]?.repeat_month_frequency}
                                    onChange={(e) =>
                                        handleChange(currentFormIndex, "repeat_month_frequency", Number(e.target.value))
                                    }
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <MenuItem key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Start Year"
                                    value={formData[currentFormIndex]?.start_year || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d{0,4}$/.test(value)) {
                                            handleChange(currentFormIndex, "start_year", value === "" ? "" : Number(value));
                                        }
                                    }}
                                    type="number"
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl fullWidth sx={{ "& .MuiInputBase-root": { height: "56px" } }}>
                                    <InputLabel id="start_month">Start Month</InputLabel>
                                    <Select
                                        labelId="start_month"
                                        label="Start Month"
                                        value={formData[currentFormIndex]?.start_month}
                                        onChange={(e) =>
                                            handleChange(currentFormIndex, "start_month", Number(e.target.value))
                                        }
                                    >
                                        {months.map((month: any) => (
                                            <MenuItem key={month.value} value={month.value}>
                                                {month.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid mt={2}>
                            <FormControl fullWidth>
                                <InputLabel id="paydata_schedule_type">Schedule Type</InputLabel>
                                <Select
                                    labelId="paydata_schedule_type"
                                    label="Schedule Type"
                                    value={formData[currentFormIndex]?.paydata_schedule_type}
                                    onChange={(e) => handleChange(currentFormIndex, "paydata_schedule_type", e.target.value)}
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                >
                                    <MenuItem value="NeverStop">Never Stop</MenuItem>
                                    <MenuItem value="UntilDate">Run until specific year/month</MenuItem>
                                    <MenuItem value="UntilOccurrences">Run until defined occurrences</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {formData[currentFormIndex]?.paydata_schedule_type === "UntilDate" && (
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Run Until Year"
                                        value={formData[currentFormIndex]?.run_until_year || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,4}$/.test(value)) {
                                                handleChange(currentFormIndex, "run_until_year", value === "" ? "" : Number(value));
                                            }
                                        }}
                                        type="number"
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl fullWidth sx={{ "& .MuiInputBase-root": { height: "56px" } }}>
                                        <InputLabel id="run-until-month">Run Until Month</InputLabel>
                                        <Select
                                            labelId="run-until-month"
                                            label="Run Until Month"
                                            value={formData[currentFormIndex]?.run_until_month}
                                            onChange={(e) =>
                                                handleChange(currentFormIndex, "run_until_month", Number(e.target.value))
                                            }
                                        >
                                            {months.map((month: any) => (
                                                <MenuItem key={month.value} value={month.value}>
                                                    {month.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}

                        {formData[currentFormIndex]?.paydata_schedule_type === "UntilOccurrences" && (
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Run Until Occurrence"
                                value={formData[currentFormIndex]?.run_until_occurance}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const cleanedValue = value.replace(/^0+(?=\d)/, '');
                                    handleChange(currentFormIndex, "run_until_occurance", cleanedValue === "" ? "" : Number(cleanedValue));
                                }}
                                type="number"
                            />
                        )}
                    </>
                )}

            </DialogContent>
            <DialogActions>
                {!data &&
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={handleScheduleCheckboxChange}
                                checked={formData[0].paydata_checkbox}
                                disabled={parent}
                            />
                        }
                        label="Paydata Schedule"
                    />
                }
                <Button onClick={handleClose} variant="contained">
                    Close
                </Button>
                {currentFormIndex > 0 && (
                    <Button onClick={handlePreviousForm} variant="outlined">
                        Previous
                    </Button>
                )}
                {showParent && hasChildren ? (
                    <Button onClick={handleNextForm} variant="contained">
                        Next
                    </Button>
                ) : (
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default Add;