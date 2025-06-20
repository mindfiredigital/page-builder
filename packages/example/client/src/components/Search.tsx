import { TextField, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { SearchProps } from "../types/types";

const Search: React.FC<SearchProps> = ({
    onSearch,
    placeholder = "Search",
    initialSearchText = "",
    debounceTime = 500,
}) => {
    const [state, setState] = useState({
        searchText: initialSearchText,
        isUserInteracted: false
    });

    const debouncedSearch = debounce((value: string) => {
        if (state.isUserInteracted && (value.length >= 4 || value.length === 0)) {
            onSearch(value);
        }
    }, debounceTime);

    useEffect(() => {
        debouncedSearch(state.searchText);
        return () => {
            debouncedSearch.cancel();
        };
    }, [state.searchText, state.isUserInteracted, debouncedSearch]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState((prevState) => ({
            ...prevState,
            searchText: event.target.value,
            isUserInteracted: true
        }));
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <TextField
                label={placeholder}
                variant="outlined"
                size="small"
                value={state.searchText}
                onChange={handleInputChange}
                fullWidth
            />
        </Box>
    );
};

export default Search;