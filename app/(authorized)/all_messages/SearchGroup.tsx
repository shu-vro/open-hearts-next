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
}: {
    searching: boolean;
    setSearching: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <Collapse in={searching} className="my-2 mx-1 w-[calc(100%-1rem)]">
            <div>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="search_in_group">
                        Group Link
                    </InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="search_in_group"
                        label="Group Link"
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
