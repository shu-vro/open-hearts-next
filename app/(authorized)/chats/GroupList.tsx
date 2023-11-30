"use client";
import { Avatar, Box, Typography } from "@mui/material";
import HoverWrapper from "../HoverWrapper";
import { cn, determineMessageType, repeat } from "@/lib/utils";
import { IGroupDetails, MessageType } from "@/app";
import Link from "next/link";
import { auth } from "@/firebase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAllMessages } from "@/contexts/AllMessagesContext";
import removeMd from "remove-markdown";

dayjs.extend(relativeTime);

export function GroupList({ group }: { group: IGroupDetails }) {
    const isActive = Math.random() <= 0.5 ? true : false;
    const { messages } = useAllMessages();
    const lastMessage = messages.find(
        (e) => e.id === group.lastMessage.message
    );
    let typeOfMessage = determineMessageType(
        lastMessage as MessageType
    ) as string;

    typeOfMessage ??= "message";

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
                    src={group?.photoURL}
                    alt={group?.name || "Group"}
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
                    {dayjs(group?.lastMessage?.sentTime?.toMillis()).fromNow()}
                </Typography>
                <Typography
                    variant="subtitle2"
                    className="line-clamp-2"
                    sx={{
                        opacity: group.lastMessage.seenBy.includes(
                            auth.currentUser?.uid!
                        )
                            ? 0.7
                            : 1,
                        gridArea: "message",
                    }}
                >
                    {group.lastMessage.by}:{" "}
                    {lastMessage?.deleted
                        ? `deleted a message`
                        : typeOfMessage === "text"
                        ? removeMd(lastMessage?.text || "")
                        : `sent a ${typeOfMessage}`}
                </Typography>
            </Box>
        </HoverWrapper>
    );
}
