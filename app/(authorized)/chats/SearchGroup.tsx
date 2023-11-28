import {
    Collapse,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function SearchGroup({
    searching,
    setSearching,
    setSearchGroup,
}: {
    searching: boolean;
    setSearching: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchGroup: React.Dispatch<React.SetStateAction<RegExp>>;
}) {
    return (
        <Collapse in={searching} className="my-2 mx-1 w-[calc(100%-1rem)]">
            <div>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="search_group">Search...</InputLabel>
                    <OutlinedInput
                        fullWidth
                        onChange={(e) => {
                            let text = e.target.value.trim();
                            text = text
                                .split("")
                                .map((x, i) => {
                                    if (i !== text.length - 1) {
                                        return x + ".*";
                                    }
                                    return x;
                                })
                                .join("");

                            setSearchGroup(RegExp(text, "gi"));
                        }}
                        id="search_group"
                        label="Search..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => {
                                        setSearching(false);
                                    }}
                                    edge="end"
                                >
                                    <IoCloseCircleOutline />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </div>
        </Collapse>
    );
}
