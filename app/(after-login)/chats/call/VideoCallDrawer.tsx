"use client";

import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/contexts/SocketContext";
import { VideoCallMessage } from "@/pages/api/socket";

function Message({ by, msg }: { by: "him" | "me"; msg: VideoCallMessage }) {
    if (msg.type === "message") {
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
                <Typography
                    noWrap
                    component="span"
                    className="name text-slate-600 dark:text-slate-300 capitalize"
                    sx={{ gridArea: "name" }}
                >
                    {msg.name}
                </Typography>
                <div
                    className="time text-xs text-slate-400 justify-self-end"
                    style={{ gridArea: "time" }}
                >
                    {new Date(msg.time).toLocaleTimeString()}
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
                    {msg.message}
                </Box>
            </div>
        );
    } else if (msg.type === "member_info") {
        return (
            <>
                <Box
                    className="m-auto rounded-lg w-fit px-2"
                    sx={{
                        bgcolor: (theme) => theme.palette.primary.main,
                    }}
                >
                    {msg.message}
                </Box>
                <Box className="text-slate-400 text-xs w-fit m-auto">
                    {new Date(msg.time).toLocaleTimeString()}
                </Box>
            </>
        );
    }
}

export default function VideoCallDrawer() {
    const my_name = "shuvro";
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState<VideoCallMessage[]>([]);
    const form = useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();
    const { socket } = useSocket();
    useEffect(() => {
        socket!?.on("connect", () => {
            socket.emit(
                "user:join_room",
                searchParams?.get("groupId")!,
                "Purabi"
            );

            socket.on("send_msg", (data) => {
                setChats((prev) => [...prev, data]);
            });
            socket.on("user:friend_joined_or_left_message", (data) => {
                setChats((prev) => [...prev, data]);
            });
        });
    }, [socket]);

    return (
        <form
            ref={form}
            onSubmit={() => {
                socket?.send({
                    name: "shuvro",
                    time: Date.now(),
                    message: message.trim(),
                    type: "message",
                });
                setMessage("");
            }}
            className="flex flex-col h-full"
        >
            <div className="chat grow">
                <div className="chat-section h-[calc(100vh-56px)] overflow-y-auto">
                    {chats.map((msg) => (
                        <Message
                            by={my_name === msg.name ? "me" : "him"}
                            msg={msg}
                            key={msg.time}
                        />
                    ))}
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
