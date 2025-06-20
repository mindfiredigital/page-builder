import { TextField } from "@mui/material";
import { InputProp } from "../types/types";

const Input: React.FC<InputProp> = ({
    id,
    label,
    name,
    type = "text",
    value,
    onChange,
    onBlur,
    error,
    errorText,
    maxLength,
    disabled = false,
    placeholder,
    tabIndex,
    sx,
    InputProps,
    multiline = false,
    rows = 1,
    required = true,
    inputRef
}) => {
    return (
        <TextField
            margin="none"
            required={required}
            fullWidth
            id={id}
            label={label}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
            helperText={errorText}
            disabled={disabled}
            placeholder={placeholder}
            tabIndex={tabIndex}
            style={{ marginBottom: "20px" }}
            sx={sx}
            InputProps={{
                ...InputProps,
            }}
            inputRef={inputRef}
            inputProps={{ maxLength }}
            multiline={multiline}
            rows={rows}
        />
    );
};

export default Input;
