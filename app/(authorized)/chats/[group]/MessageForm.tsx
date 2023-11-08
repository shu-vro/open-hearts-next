"use client";

import TextField from "@mui/material/TextField";
import GifButton from "./GifButton";
import { useRef } from "react";
import { Box, Chip, IconButton, Typography, useTheme } from "@mui/material";
import { MdKeyboardVoice, MdSend } from "react-icons/md";
import AddMoreButton from "./AddMoreButton";
import GetEmojiLink from "./GetEmojiLink";
import { defaultMessage, useMessage } from "@/contexts/MessageContext";
import { VscClose } from "react-icons/vsc";
import lo_ from "lodash";
import { BiImages } from "react-icons/bi";
import { useGroup } from "@/contexts/GroupContext";

export default function MessageForm() {
    const { group } = useGroup();

    const { message, setMessage, replyMessage } = useMessage();
    const form = useRef<HTMLFormElement>(null);
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                setMessage(() => defaultMessage);
            }}
            ref={form}
            className="input-area flex justify-end items-center w-full relative"
            action="get"
        >
            {!lo_.isEqual(defaultMessage, replyMessage.message) && (
                <ReplySection />
            )}
            <AddMoreButton form={form.current!} />
            <TextField
                label="Type something..."
                variant="outlined"
                multiline
                maxRows={4}
                fullWidth
                className="grow z-50"
                name="message"
                value={message.text}
                onChange={(e) => {
                    setMessage((prev) => ({
                        ...prev,
                        text: e.currentTarget?.value,
                    }));
                }}
                onKeyUp={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        // Submit the form when Enter is pressed without Shift
                        form.current?.dispatchEvent(
                            new Event("submit", {
                                bubbles: true,
                            })
                        );
                        setMessage((prev) => ({ ...prev, text: "" }));
                    }
                }}
            />
            <GifButton form={form.current!} />
            {message.text === "" &&
            message.voice === "" &&
            message.imageLink.length === 0 ? (
                <IconButton
                    size="large"
                    type="button"
                    onClick={() => {
                        setMessage(() => {
                            return {
                                ...defaultMessage,
                                emoji: group?.emoji || "1f44d",
                            };
                        });
                        setTimeout(() => {
                            form.current?.dispatchEvent(
                                new Event("submit", {
                                    bubbles: true,
                                })
                            );
                        }, 100);
                    }}
                >
                    <GetEmojiLink unified={group?.emoji || "1f44d"} size={28} />
                </IconButton>
            ) : (
                <IconButton size="large" type="submit">
                    <MdSend />
                </IconButton>
            )}
        </form>
    );
}

export function ReplySection() {
    const { replyMessage: reply, setReplyMessage, setMessage } = useMessage();

    return (
        <Box
            className="replyBar absolute bottom-full left-0 w-full p-3 rounded-[.75rem_.75rem_0_0] z-10"
            sx={{
                background: (theme) => theme.palette.mySwatch.messageBG,
                gridArea: "message",
            }}
        >
            <Box
                className="grid border-[0] border-l-4 border-solid p-2 rounded-md"
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
                    {reply.to}
                </b>
                <VscClose
                    style={{
                        gridArea: "cross",
                    }}
                    className="justify-self-end cursor-pointer text-2xl"
                    onClick={() => {
                        setReplyMessage((prev) => ({
                            ...prev,
                            to: "",
                            message: {
                                ...defaultMessage,
                            },
                        }));
                        setMessage((prev) => {
                            return {
                                ...prev,
                                reply: null,
                            };
                        });
                    }}
                />
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
                                    <Chip icon={<BiImages />} label="Images" />{" "}
                                    + {reply.message.text}
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
                        {reply.type === "emoji" && (
                            <GetEmojiLink unified="1f601" />
                        )}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
