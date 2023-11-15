import { UserType } from "@/app";
import { useGroup } from "@/contexts/GroupContext";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { auth, firestoreDb } from "@/firebase";
import { DATABASE_PATH } from "@/lib/variables";
import {
    Dialog,
    DialogContent,
    Autocomplete,
    TextField,
    Checkbox,
    DialogActions,
    Box,
    Button,
    DialogTitle,
} from "@mui/material";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function AddMembersAlertDialog({
    open,
    setOpen,
    groupMembers,
    allUsers,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    groupMembers?: string[];
    allUsers: UserType[];
}) {
    const [value, setValue] = useState<UserType[]>([]);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            component="form"
            onSubmit={async (e) => {
                e.preventDefault();
            }}
        >
            <DialogTitle id="alert-dialog-title">Add Members</DialogTitle>
            <DialogContent>
                <Autocomplete
                    value={value}
                    onChange={(event: any, newValue: UserType[]) => {
                        setValue(newValue);
                    }}
                    className="w-[500px] max-w-full mt-4"
                    options={
                        allUsers.filter((u) => groupMembers?.includes(u.uid)) ||
                        false
                    }
                    groupBy={(option) => option.name[0]}
                    multiple
                    autoHighlight
                    disableCloseOnSelect
                    renderInput={(params) => (
                        <TextField {...params} label="Pick members" />
                    )}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option, { selected }) => (
                        <Box
                            key={option.uid}
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...props}
                        >
                            <Checkbox
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            <img
                                loading="lazy"
                                width="20"
                                src={option.photoURL}
                                alt=""
                            />
                            {option.name}
                        </Box>
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="error">
                    Close
                </Button>
                <Button autoFocus variant="contained" type="submit">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}
