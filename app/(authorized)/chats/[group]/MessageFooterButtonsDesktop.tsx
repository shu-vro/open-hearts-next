import { MessageType } from "@/app";
import { cn } from "@/lib/utils";
import { Chip } from "@mui/material";
import React from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { MdReport } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import PinChip from "./PinChip";
import HoverWrapper from "../../HoverWrapper";

export default function MessageFooterButtonsDesktop({
    by,
    setMessage,
    msg,
    groupId,
    setShowDeleteMessageModal,
    setShowReportMessageModal,
    sender_role,
}: {
    by: "me" | "him";
    setMessage: React.Dispatch<React.SetStateAction<MessageType>>;
    msg: MessageType;
    groupId?: string;
    setShowDeleteMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowReportMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
    sender_role: number;
}) {
    return (
        <div
            className={cn(
                "reply flex justify-center items-center flex-row-reverse",
                by === "him"
                    ? "justify-self-end"
                    : "justify-self-start flex-row"
            )}
            style={{ gridArea: "reply" }}
        >
            <HoverWrapper className="rounded-full">
                <Chip
                    icon={<AiOutlineMessage />}
                    label="Reply"
                    size="small"
                    onClick={() => {
                        setMessage((prev) => {
                            return {
                                ...prev,
                                reply: msg.id,
                            };
                        });
                    }}
                />
            </HoverWrapper>
            {by === "him" && (
                <HoverWrapper className="rounded-full">
                    <Chip
                        icon={<MdReport size="18" />}
                        label="Report"
                        size="small"
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
                        size="small"
                        onClick={function () {
                            setShowDeleteMessageModal(true);
                        }}
                    />
                </HoverWrapper>
            )}

            <PinChip
                pinned={msg.pinned}
                groupId={groupId}
                messageId={msg.id}
                sender_role={sender_role}
            />
        </div>
    );
}
