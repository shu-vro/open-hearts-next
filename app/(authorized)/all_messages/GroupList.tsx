"use client";
import { Avatar, Box, Typography } from "@mui/material";
import HoverWrapper from "../chats/HoverWrapper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn, repeat } from "@/lib/utils";
import { IGroupDetails } from "@/app";
import Link from "next/link";

dayjs.extend(relativeTime);

export function GroupList({ group }: { group: IGroupDetails }) {
    const isActive = Math.random() <= 0.5 ? true : false;
    return (
        <HoverWrapper className="mb-2 mx-1 w-[calc(100%-1rem)]">
            <Box
                component={Link}
                href={group.inviteLink}
                className="grid p-2 text-inherit hover:no-underline"
                sx={{
                    gridTemplateAreas: `
                        'avatar ${repeat("name   ", 50)} ${repeat("time", 51)}'
                        'avatar ${repeat("message", 100)} message'
                        `,
                }}
            >
                <Avatar
                    src="https://mui.com/static/images/avatar/3.jpg"
                    alt="friend's photo"
                    sx={{
                        gridArea: "avatar",
                    }}
                    className={cn(
                        "self-center mr-2 border-3 border-solid w-11 h-11",
                        isActive ? "border-green-600" : "border-red-500"
                    )}
                />
                <Typography
                    noWrap
                    className="name text-lg"
                    sx={{
                        gridArea: "name",
                    }}
                >
                    {group.name || ""}
                </Typography>
                <Typography
                    className="justify-self-end"
                    sx={{
                        gridArea: "time",
                    }}
                >
                    {dayjs(group.lastMessageSentTime).fromNow()}
                </Typography>
                <Typography
                    noWrap
                    variant="subtitle2"
                    sx={{
                        gridArea: "message",
                    }}
                >
                    {group.lastMessage}
                </Typography>
            </Box>
        </HoverWrapper>
    );
}
