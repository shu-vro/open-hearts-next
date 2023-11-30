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
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdReport } from "react-icons/md";
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

type Props = { msg: MessageType; by: "me" | "him" };

export default function DeleteOrReportChip({ msg, by }: Props) {
    const { group } = useGroup();
    const { setMessage: setToastMessage } = useToastAlert();
    const [showDeleteMessageModal, setShowDeleteMessageModal] = useState(false);
    const [showReportMessageModal, setShowReportMessageModal] = useState(false);

    const handleShowDeleteMessageModalClose = () => {
        setShowDeleteMessageModal(false);
    };
    const handleShowReportMessageModalClose = () => {
        setShowReportMessageModal(false);
    };
    return (
        <>
            {by === "him" && (
                <HoverWrapper className="rounded-full">
                    <Chip
                        icon={<MdReport size="18" />}
                        label="Report"
                        onClick={function () {
                            setShowReportMessageModal(true);
                        }}
                    />
                </HoverWrapper>
            )}
            {by === "me" && !msg.deleted && (
                <HoverWrapper className="rounded-full">
                    <Chip
                        icon={<RiDeleteBin6Fill size="18" />}
                        label="Delete"
                        onClick={function () {
                            setShowDeleteMessageModal(true);
                        }}
                    />
                </HoverWrapper>
            )}
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
                        Close
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
                        Close
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
