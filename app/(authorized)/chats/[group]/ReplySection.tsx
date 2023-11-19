"use client";
import { Box, Chip, Typography } from "@mui/material";
import { MdKeyboardVoice } from "react-icons/md";
import GetEmojiLink from "./GetEmojiLink";
import { useMessage } from "@/contexts/MessageContext";
import { VscClose } from "react-icons/vsc";
import { BiImages } from "react-icons/bi";
import { useAllMessages } from "@/contexts/AllMessagesContext";
import { determineMessageType } from "@/lib/utils";
import { useEffect } from "react";

/**
 * @required for [MessageForm.tsx](<./MessageForm.tsx>)
 */
export default function ReplySection() {
    const { replyMessage, setReplyMessage, setMessage } = useMessage();
    const { messages } = useAllMessages();
    useEffect(() => {
        console.log(replyMessage);
    }, [replyMessage]);

    const reply = messages.find((e) => e.id === replyMessage);
    const replyType = determineMessageType(reply || {});

    return reply ? (
        // <Box
        //     className="replyBar absolute bottom-full left-0 w-full py-3 rounded-[.75rem_.75rem_0_0] z-10"
        //     sx={{
        //         background: (theme) => theme.palette.mySwatch.messageBG,
        //         gridArea: "message",
        //     }}
        // >
        <Box
            className="grid border-[0] border-l-4 border-solid p-2"
            sx={{
                gridTemplateAreas: `'name cross'
                                         'message message'
                    `,
                borderColor: (theme) => theme.palette.primary.dark,
            }}
        >
            <b
                className="name capitalize"
                style={{
                    gridArea: "name",
                }}
            >
                {replyType}
            </b>
            <VscClose
                style={{
                    gridArea: "cross",
                }}
                className="justify-self-end cursor-pointer text-2xl"
                onClick={() => {
                    setReplyMessage(null);
                }}
            />
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
                    {replyType === "emoji" && (
                        <GetEmojiLink unified={reply.emoji || "1f601"} />
                    )}
                </Typography>
            )}
        </Box>
    ) : // </Box>
    null;
}
