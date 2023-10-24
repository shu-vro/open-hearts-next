"use client";

import { Avatar, Box, SpeedDial, Typography } from "@mui/material";
import HoverWrapper from "./HoverWrapper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { cn, repeat } from "@/lib/utils";
import { RiArrowGoBackLine } from "react-icons/ri";

dayjs.extend(relativeTime);

export function FriendList() {
    const [timeDiff, setTimeDiff] = useState(dayjs(1694720446951).fromNow());
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
                    Friend&apos;s name
                </Typography>
                <Typography
                    className="justify-self-end"
                    sx={{
                        gridArea: "time",
                    }}
                >
                    {timeDiff}
                </Typography>
                <Typography
                    noWrap
                    variant="subtitle2"
                    sx={{
                        gridArea: "message",
                    }}
                >
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Sed perspiciatis, quia, tenetur iusto labore, soluta
                    consectetur laboriosam voluptatem aliquid distinctio hic
                    eligendi earum vero error incidunt corporis odit? Nam,
                    explicabo!
                </Typography>
            </Box>
        </HoverWrapper>
    );
}

export default function LeftSideBar() {
    return (
        <div className="w-1/4 max-[962px]:hidden flex justify-start items-start flex-col h-full relative">
            <div className="w-full overflow-y-auto h-full">
                {Array(20)
                    .fill("")
                    .map((_, i) => (
                        <FriendList key={i} />
                    ))}
            </div>
            <SpeedDialTooltipOpen />
        </div>
    );
}

import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

const actions = [
    { icon: <RiArrowGoBackLine />, name: "Copy" },
    { icon: <RiArrowGoBackLine />, name: "Save" },
    { icon: <RiArrowGoBackLine />, name: "Print" },
    { icon: <RiArrowGoBackLine />, name: "Share" },
];

function SpeedDialTooltipOpen() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box>
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={{ position: "absolute", bottom: 16, left: 16 }}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        tooltipPlacement="right"
                        onClick={handleClose}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}
