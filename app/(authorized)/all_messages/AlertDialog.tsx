"use client";
import { Autocomplete, Box, Checkbox, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FirstTimeOpeningGroup } from "@/lib/helpers/firebase-helpers";
import { useGroup } from "@/contexts/GroupContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, firestoreDb } from "@/firebase";
import { DATABASE_PATH } from "@/lib/variables";
import { UserType } from "@/app";

export function AlertDialog({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [name, setName] = useState("");
    const [value, setValue] = useState<string[]>([]);
    const [allUsers, setAllUsers] = useState<UserType[]>([]);
    const { setGroup } = useGroup();

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        (async () => {
            if (!auth.currentUser?.uid) return;
            const q = query(
                collection(firestoreDb, DATABASE_PATH.users),
                where("uid", "!=", auth.currentUser?.uid)
            );
            let allDocs = await getDocs(q);
            if (!allDocs.empty) {
                setAllUsers(
                    allDocs.docs
                        .map((doc) => doc.data() as UserType)
                        .sort((a, b) => -b.name[0].localeCompare(a.name[0]))
                );
            }
        })();
    }, []);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            component="form"
            onSubmit={async (e) => {
                e.preventDefault();

                try {
                    const groupDetails = await FirstTimeOpeningGroup(false, {
                        name,
                        invited: value,
                    });
                    if (groupDetails) {
                        setGroup(groupDetails);
                        handleClose();
                    }
                } catch (e) {
                    alert("Error! \ncheck console");
                }
            }}
        >
            <DialogTitle id="alert-dialog-title">Create a group</DialogTitle>
            <DialogContent>
                <TextField
                    className="w-[500px] max-w-full mt-4"
                    label="Pick a name"
                    required
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <Autocomplete
                    // value={value}
                    // onChange={(event: any, newValue: string[]) => {
                    //     setValue(newValue);
                    //     console.log(newValue);
                    // }}
                    className="w-[500px] max-w-full mt-4"
                    // options={["shuvro", "shirshen", "purabi", "taposh"]}
                    options={allUsers}
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
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}
