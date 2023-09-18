"use client";

import { AppBar, Avatar, IconButton } from "@mui/material";
import Link from "next/link";
import React from "react";
import { BsCameraVideo, BsInfoLg, BsTelephone } from "react-icons/bs";

export default function AppBarChat() {
    return (
        <AppBar
            position="static"
            className="flex justify-center items-center flex-row p-2 gap-4 text-current"
            sx={{
                bgcolor: (theme) => theme.palette.mySwatch.messageBG,
            }}
        >
            <Avatar
                src="https://mui.com/static/images/avatar/3.jpg"
                alt="avatar"
                sx={{ width: 56, height: 56 }}
            />
            <span className="grow text-2xl capitalize font-semibold">
                My name
            </span>
            <IconButton
                LinkComponent={Link}
                href="/chats/call?mode=audio&groupId=room-1"
            >
                <BsTelephone />
            </IconButton>
            <IconButton
                LinkComponent={Link}
                href="/chats/call?mode=video&groupId=room-1"
            >
                <BsCameraVideo />
            </IconButton>
            <IconButton
                className="hidden max-[962px]:flex"
                LinkComponent={Link}
                href={`/chats/group_info?groupId=${123456789}`}
            >
                <BsInfoLg />
            </IconButton>
        </AppBar>
    );
}
