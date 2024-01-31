import { useGroup } from "@/contexts/GroupContext";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { auth, firestoreDb } from "@/firebase";
import { sendInfoMessageToGroup } from "@/lib/helpers/firebase-helpers";
import { DATABASE_PATH, SITEMAP } from "@/lib/variables";
import { LoadingButton } from "@mui/lab";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from "@mui/material";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LeaveGroup() {
    const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const { group } = useGroup();
    const { setMessage } = useToastAlert();
    const { push } = useRouter();

    const handleCloseLeaveDialog = () => {
        setOpenLeaveDialog(false);
    };
    return (
        <>
            <Button
                color="error"
                variant="contained"
                className="block max-w-[600px] mx-auto my-4"
                sx={{ mx: "auto", display: `block` }}
                fullWidth
                onClick={() => {
                    setOpenLeaveDialog(true);
                }}
            >
                Leave Group
            </Button>
            <Dialog
                open={openLeaveDialog}
                onClose={handleCloseLeaveDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Leave Group?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure to leave{" "}
                        <Typography color="primary.main" component={"span"}>
                            {group?.name || "<group-name>"}
                        </Typography>{" "}
                        group?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        loading={loading}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                if (!group) return;
                                if (!auth.currentUser) return;

                                const myInfoOnGroup =
                                    group.groupMembersBasicDetails.find(
                                        (e) => e.id === auth.currentUser?.uid
                                    );

                                if (!myInfoOnGroup) {
                                    return setMessage(
                                        "Error: something went wrong. please reLogin"
                                    );
                                }
                                await sendInfoMessageToGroup(
                                    `${myInfoOnGroup.nickname} [${myInfoOnGroup.id}] has left the group`,
                                    group.id,
                                    myInfoOnGroup
                                );

                                await updateDoc(
                                    doc(
                                        firestoreDb,
                                        DATABASE_PATH.groupDetails,
                                        group.id
                                    ),
                                    {
                                        groupMembers: arrayRemove(
                                            auth.currentUser?.uid
                                        ),
                                    }
                                );
                                setMessage("You left from group.");
                                push(SITEMAP.chats);
                            } catch (e) {
                                setMessage("Error: check console");
                                console.log(e);
                            }
                            setLoading(false);
                            handleCloseLeaveDialog();
                        }}
                        variant="contained"
                        color="error"
                    >
                        <span>Yes</span>
                    </LoadingButton>
                    <Button onClick={handleCloseLeaveDialog} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
