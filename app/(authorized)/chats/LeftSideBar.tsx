"use client";

import { Avatar, Box, Typography } from "@mui/material";
import HoverWrapper from "./HoverWrapper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn, repeat } from "@/lib/utils";
import SpeedDialTooltip from "../all_messages/SpeedDialTooltip";
import { IGroupDetails } from "@/app";
import useFetchGroup from "@/lib/hooks/useFetchGroup";

dayjs.extend(relativeTime);

export function GroupList({ group }: { group: IGroupDetails }) {
    const isActive = Math.random() <= 0.5 ? true : false;
    return (
        <HoverWrapper className="mb-2 mx-1 w-[calc(100%-1rem)]">
            <Box
                component="a"
                href="#"
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

export default function LeftSideBar() {
    const groups = useFetchGroup();

    return (
        <div className="w-1/4 max-[962px]:hidden flex justify-start items-start flex-col h-full relative">
            <div className="w-full overflow-y-auto h-full">
                {groups.map((group, i) => (
                    <GroupList key={group.id} group={group} />
                ))}
                {!groups.length && <NoGroupBanner />}
            </div>
            <SpeedDialTooltip />
        </div>
    );
}

export function NoGroupBanner() {
    return (
        <div className="w-full h-full flex justify-center items-center flex-col">
            <div className="text-[max(3vw,3vh)] text-center">
                ¯\_( ͡° ͜ʖ ͡°)_/¯
            </div>
            <span className="text-center capitalize">
                Groups you are added will appear here
            </span>
        </div>
    );
}
