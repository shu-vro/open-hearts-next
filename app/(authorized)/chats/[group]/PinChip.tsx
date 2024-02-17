import React from "react";
import HoverWrapper from "../../HoverWrapper";
import { Chip } from "@mui/material";
import { PiPushPinDuotone } from "react-icons/pi";
import { MessageType, TGroupMembersBasicDetails } from "@/app";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestoreDb } from "@/firebase";
import { DATABASE_PATH, ROLE } from "@/lib/variables";

export default function PinnedChip({
    pinned,
    groupId,
    messageId,
    sender_role,
}: {
    pinned: MessageType["pinned"];
    groupId?: string;
    messageId: string;
    sender_role: TGroupMembersBasicDetails["role"];
}) {
    const { setMessage: setToastMessage } = useToastAlert();
    return sender_role < ROLE.member ? (
        <HoverWrapper className="rounded-full">
            <Chip
                icon={<PiPushPinDuotone />}
                size="small"
                clickable
                label={pinned ? "unpin" : "pin"}
                onClick={async () => {
                    if (!groupId)
                        return setToastMessage("Group is not resolved");
                    if (!auth.currentUser)
                        return setToastMessage("User is not resolved");
                    try {
                        await setDoc(
                            doc(
                                firestoreDb,
                                DATABASE_PATH.groupDetails,
                                groupId as string,
                                DATABASE_PATH.messages,
                                messageId
                            ),
                            {
                                pinned: !pinned,
                            } as Partial<MessageType>,
                            {
                                merge: true,
                            }
                        );
                    } catch (e) {
                        setToastMessage("Error: pinned message went wrong!");
                    }
                }}
            />
        </HoverWrapper>
    ) : null;
}
