import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, SelectChangeEvent, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { toast } from "sonner";
import { AddPaydataProps } from "../../types/types";
import { paydataCreate } from "../../services/services";
import { COMMON, PAYDATA } from "../../utils/constant";
import { getYears, getMonthName } from "../../utils/utils";
import AppButton from "../../components/Button";

const Add = ({ open, onClose }: AddPaydataProps) => {
    const [state, setState] = useState({
        month: `${new Date().getMonth() + 1}`,
        year: `${new Date().getFullYear()}`,
        loading: false
    });

    const [years] = useState(getYears());
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setState(prev => ({ ...prev, loading: true }));

        const response = await paydataCreate({ 
            month: Number(state.month), 
            year: Number(state.year)
        });

        if (response?.success) {
            toast.success(response.message);
            setState(prev => ({ ...prev, month: `${new Date().getMonth() + 1}`, year: `${new Date().getFullYear()}` }));
            onClose(true);
        }

        setState(prev => ({ ...prev, loading: false }));
    };

    const handleClose = () => {
        setState(prev => ({ ...prev, month: `${new Date().getMonth() + 1}`, year: `${new Date().getFullYear()}` }));
        onClose(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>{PAYDATA.CREATE}</DialogTitle>

            <DialogContent sx={{ paddingTop: "10px !important" }}>

                <FormControl fullWidth sx={{ marginBottom: 3 }} disabled={state.loading}>
                    <InputLabel>Year</InputLabel>
                    <Select
                        labelId="year"
                        value={state.year}
                        onChange={(e: SelectChangeEvent<string>) =>
                            setState(prev => ({
                                ...prev,
                                year: e.target.value
                            }))
                        }
                        label="Year"
                        variant="outlined"
                        name="year"
                    >
                        {years.map(year => (
                            <MenuItem key={year} value={year.toString()}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth disabled={state.loading}>
                    <InputLabel>Month</InputLabel>
                    <Select
                        labelId="month"
                        value={state.month}
                        onChange={(e: SelectChangeEvent<string>) =>
                            setState(prev => ({
                                ...prev,
                                month: e.target.value
                            }))
                        }
                        label="Month"
                        variant="outlined"
                        name="month"
                    >
                        {months.map(month => (
                            <MenuItem key={month} value={month.toString()}>
                                {getMonthName(month)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions sx={{ px: "24px", py: 1 }}>
                <AppButton
                    id="cancel-button"
                    label={COMMON.CANCEL}
                    onClick={handleClose}
                    variant="text"
                    type="button"
                    tabIndex={2}
                />
                <AppButton
                    id="save"
                    label={COMMON.CREATE}
                    onClick={handleSave}
                    textColor="primary"
                    type="submit"
                    loading={state.loading}
                    disabled={state.loading}
                    tabIndex={3}
                />
            </DialogActions>
        </Dialog>
    );
};

export default Add;
