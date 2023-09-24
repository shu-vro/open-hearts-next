"use client";

import { AppBar, Avatar, IconButton, Toolbar } from "@mui/material";
import Link from "next/link";
import React from "react";
import { BsCameraVideo, BsInfoLg, BsTelephone } from "react-icons/bs";

export default function AppBarChat() {
    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: (theme) => theme.palette.mySwatch.messageBG,
            }}
        >
            <Toolbar>
                <Avatar
                    src="https://mui.com/static/images/avatar/3.jpg"
                    alt="avatar"
                    sx={{ width: 56, height: 56 }}
                />
                <span className="grow text-2xl capitalize font-semibold ml-3">
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
                    href={`/chats/group_info?groupId=${0}`}
                >
                    <BsInfoLg />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
