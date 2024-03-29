import React, { useState } from "react";
import HoverWrapper from "../../HoverWrapper";
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useGroup } from "@/contexts/GroupContext";
import { auth, firestoreDb } from "@/firebase";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import {
    addDoc,
    doc,
    setDoc,
    collection,
    Timestamp,
    serverTimestamp,
} from "firebase/firestore";
import { DATABASE_PATH } from "@/lib/variables";
import { MessageType, ReportDocument } from "@/app";
import { useAllMessages } from "@/contexts/AllMessagesContext";

type Props = {
    msg: MessageType;
    showDeleteMessageModal: boolean;
    showReportMessageModal: boolean;
    setShowReportMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowDeleteMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteOrReportChip({
    msg,
    showDeleteMessageModal,
    showReportMessageModal,
    setShowDeleteMessageModal,
    setShowReportMessageModal,
}: Props) {
    const { group } = useGroup();
    const { setMessage: setToastMessage } = useToastAlert();
    const {
        messages: { length: lenOfMessages },
    } = useAllMessages();

    const handleShowDeleteMessageModalClose = () => {
        setShowDeleteMessageModal(false);
    };
    const handleShowReportMessageModalClose = () => {
        setShowReportMessageModal(false);
    };
    return (
        <>
            {/* REPORT DIALOG */}
            <Dialog
                open={showReportMessageModal}
                onClose={handleShowReportMessageModalClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Report this message?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        If you find this message inappropriate, offensive, or
                        against our community guidelines, please report it. Your
                        feedback helps us maintain a safe and enjoyable
                        environment for everyone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleShowReportMessageModalClose}
                        variant="contained"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={async () => {
                            if (!group)
                                return setToastMessage(
                                    "Error: Group is not resolved"
                                );
                            if (!auth.currentUser)
                                return setToastMessage(
                                    "Error: User is not resolved"
                                );

                            const path = `${DATABASE_PATH.groupDetails}/${group.id}/${DATABASE_PATH.messages}/${msg.id}`;
                            await addDoc(
                                collection(firestoreDb, DATABASE_PATH.reports),
                                {
                                    path,
                                    reported_by: auth.currentUser.uid,
                                    reported_to: msg.sender_id,
                                    user_doc: `${DATABASE_PATH.users}/${msg.sender_id}`,
                                    group: group.id,
                                    report_created_at:
                                        serverTimestamp() as Timestamp,
                                } as ReportDocument
                            );
                            await setDoc(
                                doc(
                                    firestoreDb,
                                    DATABASE_PATH.groupDetails,
                                    group.id,
                                    DATABASE_PATH.messages,
                                    msg.id
                                ),
                                {
                                    reportCount: (msg?.reportCount ?? 0) + 1,
                                    deleted:
                                        Math.ceil(Math.sqrt(lenOfMessages)) <
                                            msg?.reportCount + 1 ?? 0
                                            ? true
                                            : false,
                                } as Partial<MessageType>,
                                {
                                    merge: true,
                                }
                            );

                            setToastMessage("Reported Successfully");
                            handleShowReportMessageModalClose();
                        }}
                        variant="contained"
                        color="error"
                    >
                        Report
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DELETE DIALOG */}
            <Dialog
                open={showDeleteMessageModal}
                onClose={handleShowDeleteMessageModalClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Confirm you want to delete message?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This message will be unsent for everyone in the chat.
                        Others may have already seen it. Unsent messages can
                        still be included in reports.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleShowDeleteMessageModalClose}
                        variant="contained"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={async () => {
                            if (!group)
                                return setToastMessage(
                                    "Error: Group is not resolved"
                                );
                            if (!auth.currentUser)
                                return setToastMessage(
                                    "Error: User is not resolved"
                                );
                            let newMsg = { ...msg };
                            newMsg.deleted = true;
                            await setDoc(
                                doc(
                                    firestoreDb,
                                    DATABASE_PATH.groupDetails,
                                    group.id,
                                    "messages",
                                    msg.id
                                ),
                                newMsg,
                                {
                                    merge: true,
                                }
                            );
                            handleShowDeleteMessageModalClose();
                        }}
                        variant="contained"
                        color="error"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
