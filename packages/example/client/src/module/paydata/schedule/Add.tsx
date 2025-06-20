import { useState, useEffect, useCallback } from "react";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { paydataPeopleCodeList, paydataPeopleTypeList, paydataScheduleCreate, paydataScheduleUpdate } from "../../../services/services";
import { AddPaydataScheduleProps, months } from "../../../types/types";

const Add = ({ open, onClose, onSave, data }: AddPaydataScheduleProps) => {
    const now = new Date();
    const { id } = useParams();
    const [formData, setFormData] = useState([
        {
            paydata_type_id: "",
            people_code: "",
            amount: "",
            note: "",
            currency: "INR",
            start_year: now.getFullYear(),
            start_month: (now.getMonth() + 1),
            repeat_month_frequency: "",
            paydata_schedule_type: "",
            run_until_year: "",
            run_until_month: "",
            run_until_occurance: "",
        }
    ]);
    const [currentFormIndex, setCurrentFormIndex] = useState(0);
    const [hasChildren, setHasChildren] = useState(false);
    const [showParent, setShowParent] = useState(true);
    const [paydataType, setPaydatatype] = useState<{
        [x: string]: any; id: number; childId: any[]; title: string
    }[]>([]);
    const [peopleCode, setPeopleCode] = useState<{ code: string; name: string }[]>([]);
    
    const fetchData = useCallback(async () => {
        const peopleCode = await paydataPeopleCodeList();
        const paydataType = await paydataPeopleTypeList();

        if (peopleCode?.success && paydataType?.success) {
            setPaydatatype(paydataType.data || []);
            setPeopleCode(peopleCode.data || []);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 100);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleChange = (index: number, field: keyof any, value: any) => {
        if (field === "paydata_type_id") {
            const selectedType = paydataType.find((type) => type.id === value);
            setHasChildren(selectedType?.childId ? selectedType.childId.length > 0 : false);
        }

        const updatedForms = [...formData];
        updatedForms[index] = {
            ...updatedForms[index],
            [field]: value,
        };
        setFormData(updatedForms);
    };

    useEffect(() => {
        if (open && data) {
            setFormData([{
                paydata_type_id: String(data.paydata_type_id),
                people_code: data.people_code,
                amount: String(data.amount),
                note: data.note,
                currency: data.currency,
                start_year: data.start_year,
                start_month: data.start_month,
                repeat_month_frequency: String(data.repeat_month_frequency),
                paydata_schedule_type: data.paydata_schedule_type,
                run_until_year: String(data.run_until_year),
                run_until_month: String(data.run_until_month),
                run_until_occurance: String(data.run_until_occurance)
            }]);
        }
    }, [open, data]);

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
                    paydata_type_id: childPaydataTypeOption.childId[0],
                    people_code: "",
                    amount: "",
                    note: "",
                    currency: "",
                    start_year: now.getFullYear(),
                    start_month: now.getMonth() + 1,
                    repeat_month_frequency: "",
                    paydata_schedule_type: "",
                    run_until_year: "",
                    run_until_month: "",
                    run_until_occurance: ""
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

        const selectedPaydataType = paydataType.find(
            (type) => type.id === Number(formData[currentFormIndex]?.paydata_type_id)
        );

        if (selectedPaydataType?.is_recurring === "No") {
            toast.error("This paydata type is not recurring and cannot be scheduled.");
            return;
        };

        if (data) {
            const response = await paydataScheduleUpdate(data.id, formData);
            if (response?.success) {
                toast.success(response?.message);
                onSave();
                handleClose();
            }
        } else {
            const response = await paydataScheduleCreate(formData, Number(id));
            if (response?.success) {
                toast.success(response?.message);
                onSave();
                handleClose();
            }
        }
    };

    const handleClose = () => {
        setFormData([{
            paydata_type_id: "",
            people_code: "",
            amount: "",
            note: "",
            currency: "INR",
            start_year: now.getFullYear(),
            start_month: (now.getMonth() + 1),
            repeat_month_frequency: "",
            paydata_schedule_type: "",
            run_until_year: "",
            run_until_month: "",
            run_until_occurance: ""
        }]);

        onClose(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="xs">
            <DialogTitle>{data ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
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

                <Grid mt={1}>
                    <FormControl fullWidth>
                        <InputLabel id="repeat_month_frequency">Repeat Month Frequency</InputLabel>
                        <Select
                            labelId="repeat_month_frequency"
                            label="Repeat Month Frequency"
                            value={formData[currentFormIndex]?.repeat_month_frequency}
                            onChange={(e) => handleChange(currentFormIndex, "repeat_month_frequency", Number(e.target.value))}
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
                                value={formData[currentFormIndex]?.start_month || ""}
                                onChange={(e) =>
                                    handleChange(
                                        currentFormIndex,
                                        "start_month",
                                        Number(e.target.value)
                                    )
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
                            <MenuItem value="UntilOccurrences">Run until defined occurances</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {formData[currentFormIndex]?.paydata_schedule_type === "UntilDate" && (
                    <>
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
                                        labelId="run_until_month"
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
                    </>
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

            </DialogContent>
            <DialogActions>
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