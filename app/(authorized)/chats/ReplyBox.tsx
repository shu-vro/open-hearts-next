"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import Link from "next/link";
import { MessageType } from "@/app";
import { BiImages } from "react-icons/bi";
import { MdKeyboardVoice } from "react-icons/md";
import GetEmojiLink from "./GetEmojiLink";
import { Props } from "./Message";

export default function ReplyBox({
    by,
    reply,
}: {
    by: Props["by"];
    reply: MessageType["reply"];
}) {
    return reply ? (
        <Box
            component={Link}
            href={`#${"hello"}`}
            className={cn(
                "relative py-2 px-3 rounded-lg opacity-60 cursor-pointer hover:no-underline text-inherit block mt-2 pb-5"
            )}
            sx={{
                transform: "translateY(1rem)",
                bgcolor: (theme) => theme.palette.mySwatch.messageBG,
            }}
        >
            <Box className="text-xs mb-2">
                {by === "him" ? reply.to : "you"} replied to{" "}
                {by === "me" ? reply.to : "you"}
            </Box>
            {reply.message.deleted ? (
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
                    {reply.type === "text" && reply.message.text}
                    {reply.type === "image" &&
                        (reply.message.text ? (
                            <>
                                <Chip icon={<BiImages />} label="Images" /> +{" "}
                                {reply.message.text}
                            </>
                        ) : (
                            <Chip
                                icon={<BiImages />}
                                label="Replying to images"
                            />
                        ))}
                    {reply.type === "voice" && (
                        <Chip
                            icon={<MdKeyboardVoice size="20px" />}
                            label="Replying to Voice"
                        />
                    )}
                    {reply.type === "emoji" && <GetEmojiLink unified="1f601" />}
                </Typography>
            )}
        </Box>
    ) : (
        <></>
    );
}
