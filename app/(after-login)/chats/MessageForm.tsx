"use client";

import TextField from "@mui/material/TextField";
import GifButton from "./GifButton";
import { useRef } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { MdSend } from "react-icons/md";
import AddMoreButton from "./AddMoreButton";
import { GetEmojiLink } from "./Message";
import { defaultMessage, useMessage } from "@/contexts/MessageContext";
import { VscClose } from "react-icons/vsc";
import lo_ from "lodash";

export function ReplySection() {
    const { replyMessage, setReplyMessage, setMessage } = useMessage();
    const {
        palette: {
            primary: { dark },
            mySwatch: { messageBG },
        },
    } = useTheme();
    return (
        <Box
            className="replyBar absolute bottom-full left-0 w-full p-3 rounded-[.75rem_.75rem_0_0]"
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
                    {replyMessage.to}
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
                <i
                    className="message truncate"
                    style={{
                        gridArea: "message",
                    }}
                >
                    {replyMessage.type === "text" && replyMessage.message.text}
                    {replyMessage.type === "image" &&
                        (replyMessage.message.text
                            ? replyMessage.message.text
                            : "Replying to images")}
                    {replyMessage.type === "voice" && "Replying to voice"}
                    {replyMessage.type === "emoji" && (
                        <GetEmojiLink unified="1f601" size={28} />
                    )}
                </i>
            </Box>
        </Box>
    );
}

export default function MessageForm() {
    const { message, setMessage, replyMessage } = useMessage();
    const form = useRef<HTMLFormElement>(null);
    const emojiUnified = "1f601";
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                console.log(message);
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
                className="grow"
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
                            return { ...defaultMessage, emoji: emojiUnified };
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
                    <GetEmojiLink unified={emojiUnified} size={28} />
                </IconButton>
            ) : (
                <IconButton size="large" type="submit">
                    <MdSend />
                </IconButton>
            )}
        </form>
    );
}
