"use client";

import { Avatar, Box, Typography } from "@mui/material";
import HoverWrapper from "./HoverWrapper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

// import { useEffect, useRef } from "react";

function FriendList() {
    const [timeDiff, setTimeDiff] = useState(dayjs(1694720446951).fromNow());
    const isActive = true;
    return (
        <HoverWrapper className="mb-2 mx-1">
            <Box
                component="a"
                href="#"
                className="grid p-2 text-inherit hover:no-underline"
                sx={{
                    gridTemplateAreas: `
                        'avatar name time'
                        'avatar message message'
                        `,

                    bgcolor: (theme) =>
                        theme.palette.mode === "light" ? "" : "",
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
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Eum, voluptate dolorem laudantium commodi odio adipisci
                    quasi quas incidunt fugiat blanditiis facere neque
                    accusantium nesciunt dolore ullam exercitationem deserunt
                    nam! Sit.
                </Typography>
            </Box>
        </HoverWrapper>
    );
}

export default function LeftSideBar() {
    return (
        <div className="w-1/4 max-[712px]:hidden flex justify-start items-start flex-col h-full">
            <div className="w-full overflow-y-auto h-full">
                {Array(20)
                    .fill("")
                    .map((_, i) => (
                        <FriendList key={i} />
                    ))}
            </div>
        </div>
    );
}
