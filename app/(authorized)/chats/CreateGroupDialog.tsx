"use client";
import { Autocomplete, Box, Checkbox, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FirstTimeOpeningGroup } from "@/lib/helpers/firebase-helpers";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, firestoreDb } from "@/firebase";
import { DATABASE_PATH } from "@/lib/variables";
import { IGroupDetails, UserType } from "@/app";
import { useRouter } from "next/navigation";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { ROLE } from "@/lib/variables";
// @ts-ignore
import Identicon from "react-identicons";
import { cn } from "@/lib/utils";

export default function CreateGroupDialog({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [name, setName] = useState("");
    const [value, setValue] = useState<UserType[]>([]);
    const [allUsers, setAllUsers] = useState<UserType[]>([]);
    const router = useRouter();
    const [photoURL, setPhotoURL] = useState("");

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

    useEffect(() => {
        const canvas = document.querySelector(
            "canvas.identicon"
        ) as HTMLCanvasElement;
        setPhotoURL(canvas?.toDataURL("image/png"));
    }, [name]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            component="form"
            onSubmit={async (e) => {
                e.preventDefault();

                const groupDetails = await FirstTimeOpeningGroup(false, {
                    name,
                    invited: value.map((el) => ({
                        id: el.uid,
                        nickname: el.name,
                        role: ROLE.member,
                        addedBy:
                            auth.currentUser?.uid || "creator of this group",
                        should_be_added_automatically:
                            el.accept_all_invitations,
                    })),
                    photoURL,
                });
                handleClose();
                if (groupDetails) {
                    router.push(`/chats/${groupDetails.id}`);
                }
            }}
        >
            <DialogTitle id="alert-dialog-title">Create a group</DialogTitle>
            <DialogContent>
                <Identicon
                    string={name}
                    size="80"
                    className="identicon border border-[#444] border-solid my-4 p-3 mx-auto block"
                />
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
                    value={value}
                    onChange={(event: any, newValue: UserType[]) => {
                        setValue(newValue);
                    }}
                    className="w-[500px] max-w-full mt-4"
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
                        <Tooltip
                            arrow
                            title={
                                <>
                                    Friend will{" "}
                                    {option.accept_all_invitations ? (
                                        <span className="text-green-400">
                                            Instantly
                                        </span>
                                    ) : (
                                        <span className="text-red-400">
                                            Receive an Invitation to
                                        </span>
                                    )}{" "}
                                    join the group
                                </>
                            }
                        >
                            <Box
                                key={option.uid}
                                component="li"
                                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                {...props}
                            >
                                <>
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

                                    <div
                                        className={cn(
                                            "w-4 h-4 rounded-full ml-auto",
                                            option.accept_all_invitations
                                                ? `bg-green-400`
                                                : `bg-red-400`
                                        )}
                                    ></div>
                                </>
                            </Box>
                        </Tooltip>
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
