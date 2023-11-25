"use client";

import { cn, determineMessageType } from "@/lib/utils";
import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import Link from "next/link";
import { MessageType } from "@/app";
import { BiImages } from "react-icons/bi";
import { MdKeyboardVoice } from "react-icons/md";
import GetEmojiLink from "./GetEmojiLink";
import { Props } from "./Message";
import { useGroup } from "@/contexts/GroupContext";
import { useAllMessages } from "@/contexts/AllMessagesContext";

/**
 * @required for [MessageBox.tsx](<./MessageBox.tsx>)
 */
export default function ReplyBox({
    by,
    replyId,
}: {
    by: Props["by"];
    replyId: MessageType["reply"];
}) {
    const { group } = useGroup();
    const { messages } = useAllMessages();
    const reply = messages.find((e) => e.id === replyId);
    const replyType = determineMessageType(reply || {});
    const sender = group?.groupMembersBasicDetails.find(
        (e) => e.id === reply?.sender_id
    );
    return reply ? (
        <Box
            component={Link}
            href={`#${replyId}`}
            className={cn(
                "relative py-2 px-3 rounded-lg opacity-60 cursor-pointer hover:no-underline text-inherit block mt-2 pb-5"
            )}
            sx={{
                transform: "translateY(1rem)",
                bgcolor: (theme) => theme.palette.mySwatch.messageBG,
            }}
        >
            <Box className="text-xs mb-2">
                {by === "him" ? sender?.nickname || "he" : "you"} replied to{" "}
                {by === "me" ? sender?.nickname || "he" : "you"}
            </Box>
            {reply.deleted ? (
                <Typography
                    noWrap
                    className="message truncate w-full text-sm p-3 rounded-lg"
                    style={{
                        maxWidth: "300px",
                        gridArea: "message",
                    }}
                >
                    This message was deleted by sender
                </Typography>
            ) : (
                <Typography
                    className="message line-clamp-3 w-full text-sm"
                    style={{
                        maxWidth: "300px",
                        gridArea: "message",
                    }}
                >
                    {replyType === "text" && reply.text}
                    {replyType === "image" &&
                        (reply.text ? (
                            <>
                                <Chip icon={<BiImages />} label="Images" /> +{" "}
                                {reply.text}
                            </>
                        ) : (
                            <Chip
                                icon={<BiImages />}
                                label="Replying to images"
                            />
                        ))}
                    {replyType === "voice" && (
                        <Chip
                            icon={<MdKeyboardVoice size="20px" />}
                            label="Replying to Voice"
                        />
                    )}
                    {replyType === "emoji" && <GetEmojiLink unified="1f601" />}
                </Typography>
            )}
        </Box>
    ) : (
        <></>
    );
}
