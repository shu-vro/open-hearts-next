"use client";

import TextField from "@mui/material/TextField";
import GifButton from "./GifButton";
import { Message } from "@/app";
import React, { useRef } from "react";
import { IconButton } from "@mui/material";
import { MdSend } from "react-icons/md";

type Props = {
    message: Message;
    setMessage: React.Dispatch<React.SetStateAction<Message>>;
};

export default function MessageForm({ message, setMessage }: Props) {
    const form = useRef<HTMLFormElement>(null);
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                console.log(message);
                setMessage((prev) => ({
                    ...prev,
                    text: "",
                    imageLink: [],
                    emoji: "",
                }));
            }}
            ref={form}
            className="input-area flex justify-end items-center w-full"
            action="get"
        >
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
            <GifButton setMessage={setMessage} form={form.current!} />
            <IconButton size="large" type="submit">
                <MdSend />
            </IconButton>
        </form>
    );
}
