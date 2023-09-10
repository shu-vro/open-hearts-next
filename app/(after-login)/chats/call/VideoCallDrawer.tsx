"use client";

import { Box, TextField } from "@mui/material";
import React, { useRef, useState } from "react";

type Props = {};

function Message({ by }: { by: "him" | "me" }) {
    return (
        <div
            className="grid ml-2 mb-4"
            style={{
                gridTemplateAreas: `
            'name time'
            'message message'
            `,
            }}
        >
            <span
                className="name text-slate-600 dark:text-slate-300"
                style={{ gridArea: "name" }}
            >
                Some name
            </span>
            <div
                className="time text-xs text-slate-400 justify-self-end"
                style={{ gridArea: "time" }}
            >
                {new Date(1694258767572).toLocaleTimeString()}
            </div>
            <Box
                className="message p-3 rounded-lg"
                sx={{
                    gridArea: "message",
                    background: (theme) =>
                        by === "him"
                            ? theme.palette.mode === "dark"
                                ? theme.palette.grey[900]
                                : theme.palette.grey[300]
                            : theme.palette.primary.light,

                    color: (theme) =>
                        by === "me" ? theme.palette.grey[50] : "",
                }}
            >
                Lorem ipsum dolor
            </Box>
        </div>
    );
}

export default function VideoCallDrawer() {
    const [message, setMessage] = useState("");
    const form = useRef<HTMLFormElement>(null);
    return (
        <form
            ref={form}
            onSubmit={() => {
                console.log(message);
                setMessage("");
            }}
            className="flex flex-col h-full"
        >
            <div className="chat grow">
                <div className="chat-section h-[calc(100vh-56px)] overflow-y-auto">
                    <Message by="me" />
                    <Message by="him" />
                </div>
            </div>
            <TextField
                label="Type something..."
                variant="filled"
                multiline
                maxRows={4}
                fullWidth
                name="message"
                value={message}
                onChange={(e) => {
                    setMessage(e.currentTarget.value);
                }}
                onKeyUp={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        // Submit the form when Enter is pressed without Shift
                        form.current?.dispatchEvent(
                            new Event("submit", {
                                bubbles: true,
                            })
                        );
                    }
                }}
            />
        </form>
    );
}
