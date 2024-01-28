import { TGroupMembersBasicDetails, UserType } from "@/app";
import { useGroup } from "@/contexts/GroupContext";
import { auth, firestoreDb } from "@/firebase";
import { changeGroupInformation } from "@/lib/helpers/firebase-helpers";
import { DATABASE_PATH, ROLE } from "@/lib/variables";

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
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function AddMembersAlertDialog({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [allUsers, setAllUsers] = useState<UserType[]>([]);
    const [value, setValue] = useState<UserType[]>([]);
    const { group } = useGroup();
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (!group) return;
        (async () => {
            const au = await getDocs(
                query(
                    collection(firestoreDb, DATABASE_PATH.users),
                    where("uid", "not-in", group.groupMembers)
                )
            );
            if (group.groupMembers.length <= 10) {
                setAllUsers(au.docs.map((e) => e.data() as UserType));
            } else {
                setAllUsers(
                    au.docs
                        .map((e) => e.data() as UserType)
                        .filter(
                            (user) =>
                                group.groupMembers.indexOf(user.uid) === -1
                        )
                );
            }
        })();
    }, [group?.groupMembers]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            component="form"
            onSubmit={async (e) => {
                e.preventDefault();
                if (!group || !auth.currentUser) return;
                const members = value.map((member) => member.uid);
                const membersBasicDetails = value.map(
                    (member) =>
                        ({
                            id: member.uid,
                            nickname: member.name,
                            addedBy: auth.currentUser?.uid,
                            role: ROLE.member,
                        } as TGroupMembersBasicDetails)
                );

                let newGroupMember = Array.from(
                    new Set([...group.groupMembers, ...members])
                );
                let newGroupMemberBasicDetails = [
                    ...group.groupMembersBasicDetails,
                ];

                for (let i = 0; i < membersBasicDetails.length; i++) {
                    const val = membersBasicDetails[i];

                    let matched = false;
                    for (
                        let j = 0;
                        j < group.groupMembersBasicDetails.length;
                        j++
                    ) {
                        const member = group.groupMembersBasicDetails[j];
                        if (member.id === val.id) {
                            matched = true;
                            break;
                        }
                    }

                    if (!matched) {
                        newGroupMemberBasicDetails.push(val);
                    }
                }

                await changeGroupInformation(group.id, {
                    groupMembers: newGroupMember,
                    groupMembersBasicDetails: newGroupMemberBasicDetails,
                });
                handleClose();
            }}
        >
            <DialogTitle id="alert-dialog-title">Add Members</DialogTitle>
            <DialogContent>
                <Autocomplete
                    value={value}
                    onChange={(_event: any, newValue: UserType[]) => {
                        setValue(newValue);
                    }}
                    className="w-[500px] max-w-full mt-4"
                    options={
                        allUsers.filter(
                            (u) => !group?.groupMembers?.includes(u.uid)
                        ) || false
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
