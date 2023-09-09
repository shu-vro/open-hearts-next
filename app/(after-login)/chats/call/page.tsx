"use client";

import { Avatar, Box, Button, IconButton, useTheme } from "@mui/material";
import React from "react";
import { BiSolidMicrophone, BiSolidPhoneCall } from "react-icons/bi";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { FaVideo } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import { LuScreenShare } from "react-icons/lu";
import Link from "next/link";
import VideoComponent from "./VideoComponent";

function CallButtons({ style = {} }: { style?: React.CSSProperties }) {
    const {
        palette: {
            primary: { main },
        },
    } = useTheme();
    return (
        <div
            className="buttons flex justify-around items-center flex-row flex-nowrap rounded-full w-[400px] max-w-full mt-auto mb-3 py-1"
            style={{
                background: main,
                ...style,
            }}
        >
            <IconButton
                size="large"
                LinkComponent={Link}
                href="/chats/call?mode=video"
            >
                <FaVideo />
            </IconButton>
            <IconButton size="large">
                <BiSolidMicrophone />
                {/* BiSolidMicrophoneOff */}
            </IconButton>
            <IconButton size="large" disabled>
                <LuScreenShare />
            </IconButton>
            <IconButton size="large">
                <BsFillVolumeUpFill />
            </IconButton>
            <IconButton
                size="large"
                sx={{
                    bgcolor: "red",
                    "&:hover": {
                        bgcolor: "orangered",
                    },
                }}
            >
                <MdCallEnd />
            </IconButton>
        </div>
    );
}

export default function Page({
    searchParams,
}: {
    searchParams: {
        mode?: "audio" | "video";
    };
}) {
    const {
        palette: {
            primary: { main },
        },
    } = useTheme();
    const AudioCall = (
        <div className="flex justify-center items-center w-full h-full flex-col">
            <Avatar
                src="https://mui.com/static/images/avatar/3.jpg"
                className="w-[200px] h-[200px] mt-auto"
            />
            <h1>Some Name</h1>
            <div className="mb-auto">Calling...</div>
        </div>
    );
    const VideoCall = (
        <>
            <VideoComponent />
        </>
    );
    return (
        <main className="grow w-full flex justify-start items-start flex-col h-full">
            {searchParams?.mode === "audio" ? AudioCall : VideoCall}
            <Box
                className="buttons flex justify-around items-center flex-row flex-nowrap rounded-full w-[400px] max-w-full fixed left-1/2 bottom-4"
                sx={{
                    transform: "translateX(-50%)",
                    bgcolor: main,
                }}
            >
                <IconButton
                    size="large"
                    LinkComponent={Link}
                    href={`/chats/call?mode=${
                        searchParams?.mode === "audio" ? "video" : "audio"
                    }`}
                >
                    {searchParams?.mode === "audio" ? (
                        <FaVideo />
                    ) : (
                        <BiSolidPhoneCall />
                    )}
                </IconButton>
                <IconButton size="large">
                    <BiSolidMicrophone />
                    {/* BiSolidMicrophoneOff */}
                </IconButton>
                <IconButton size="large" disabled>
                    <LuScreenShare />
                </IconButton>
                <IconButton size="large">
                    <BsFillVolumeUpFill />
                </IconButton>
                <IconButton
                    size="large"
                    sx={{
                        bgcolor: "red",
                        "&:hover": {
                            bgcolor: "orangered",
                        },
                    }}
                >
                    <MdCallEnd />
                </IconButton>
            </Box>
        </main>
    );
}
