"use client";

import { useGroup } from "@/contexts/GroupContext";
import { SITEMAP } from "@/lib/variables";
import {
    AppBar,
    Avatar,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import { BsCameraVideo, BsInfoLg, BsTelephone } from "react-icons/bs";
import { GrUnorderedList } from "react-icons/gr";

export default function AppBarChat() {
    const { group } = useGroup();
    const matches_535 = useMediaQuery("(max-width: 535px)");
    const matches_962 = useMediaQuery("(max-width: 962px)");
    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: (theme) => theme.palette.mySwatch.messageBG,
            }}
        >
            <Toolbar>
                <Avatar
                    src={group?.photoURL}
                    alt="avatar"
                    sx={{ width: 56, height: 56 }}
                />
                <Typography
                    noWrap
                    className="grow text-2xl max-[535px]:text-xl capitalize font-semibold ml-3"
                >
                    {group?.name || "Group Name here"}
                </Typography>
                <Tooltip title="List Chats">
                    <IconButton
                        className="hidden max-[962px]:flex"
                        LinkComponent={Link}
                        href={SITEMAP.chats}
                        sx={{ display: matches_962 ? "flex" : "none" }}
                        size={matches_535 ? "small" : "medium"}
                    >
                        <GrUnorderedList />
                    </IconButton>
                </Tooltip>
                <IconButton
                    size={matches_535 ? "small" : "medium"}
                    LinkComponent={Link}
                    href={`${SITEMAP.call_page}?mode=audio&groupId=${group?.id}`}
                >
                    <BsTelephone />
                </IconButton>
                <IconButton
                    size={matches_535 ? "small" : "medium"}
                    LinkComponent={Link}
                    href={`${SITEMAP.call_page}?mode=video&groupId=room-1`}
                >
                    <BsCameraVideo />
                </IconButton>
                <IconButton
                    size={matches_535 ? "small" : "medium"}
                    className="hidden max-[962px]:flex"
                    LinkComponent={Link}
                    href={`${SITEMAP.group_info}/${group?.id}`}
                    sx={{
                        display: matches_962 ? "flex" : "none",
                    }}
                >
                    <BsInfoLg />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
