"use client";

import { cn, repeat } from "@/lib/utils";
import { Avatar, Box, Typography } from "@mui/material";
import HoverWrapper from "../../HoverWrapper";
import { OgObject } from "open-graph-scraper/dist/lib/types";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { URL_REGEX } from "@/lib/utils";
import { doc, getDoc, type Timestamp } from "firebase/firestore";
import { UserType } from "@/app";
import { DATABASE_PATH } from "@/lib/variables";
import { firestoreDb } from "@/firebase";

dayjs.extend(relativeTime);

export default function SharedLink({
    link,
    messageTime,
    sender,
}: {
    link: string;
    messageTime: Timestamp;
    sender: UserType | undefined;
}) {
    const [preview, setPreview] = useState(
        <Typography
            noWrap
            sx={{
                color: (theme) => theme.palette.primary.main,
            }}
        >
            {link}
        </Typography>
    );
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/chats/api", {
                    method: "post",
                    body: JSON.stringify({
                        url: link,
                        get: ["favicon", "ogDescription", "ogTitle"],
                    } as { url: string; get: (keyof OgObject)[] }),
                });
                const json = (await res.json()) as {
                    data: OgObject;
                    error: boolean;
                };
                if (!json.error) {
                    if (json.data.favicon) {
                        if (!json.data.favicon.match(URL_REGEX)) {
                            json.data.favicon =
                                new URL(link)?.origin + json.data.favicon ||
                                json.data.ogTitle;
                        }
                    }
                    const { favicon, ogTitle, ogDescription } = json.data;

                    setPreview(
                        <Box className="flex gap-x-3 flex-row justify-start items-center w-full">
                            {favicon && (
                                <Avatar
                                    src={favicon}
                                    alt={link}
                                    sx={{
                                        width: "4rem",
                                        height: "4rem",
                                    }}
                                />
                            )}
                            <Box className="">
                                <span className="hidden">&nbsp;</span>
                                {ogTitle && (
                                    <Typography
                                        variant="body1"
                                        className="text-lg"
                                        // noWrap
                                    >
                                        {ogTitle}
                                    </Typography>
                                )}
                                <Typography
                                    noWrap
                                    variant="body2"
                                    sx={{
                                        wordBreak: "break-word",
                                        color: (theme) =>
                                            theme.palette.primary.main,
                                    }}
                                >
                                    {link}
                                </Typography>
                                {ogDescription && (
                                    <Typography
                                        variant="caption"
                                        display="block"
                                        align="left"
                                        sx={{
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {ogDescription}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );
                } else {
                    console.info("failed to fetch link data ", json);
                }
            } catch (error) {
                console.info(error);
            }
        })();
    }, []);

    return (
        <HoverWrapper className="my-1.5 mx-4 w-[calc(100%-2rem)]">
            <Box
                component="a"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-inherit hover:no-underline"
                sx={
                    {
                        /**
                         * logic:
                         * avatar, name {n times} time {n+1 times}
                         * message {n * 2 + 2 times}
                         * where n >= 0
                         */
                        // gridTemplateAreas: `
                        //         'avatar ${repeat("name   ", 50)} ${repeat(
                        //     "time",
                        //     51
                        // )}'
                        //         '${repeat("message", 102)}'
                        //         `,
                    }
                }
            >
                <Box className="flex flex-row justify-center items-center max-w-full">
                    <Avatar
                        src={sender?.photoURL || link}
                        alt={sender?.name || "Friend's Name"}
                        sx={{
                            gridArea: "avatar",
                        }}
                        className={cn("self-center mr-2 w-11 h-11")}
                    />
                    <Typography noWrap className="name text-lg">
                        {sender?.name || "Friend's name"}
                    </Typography>
                    <Typography className="justify-self-end opacity-70 font-[.8em] grow">
                        {dayjs(messageTime?.toMillis()).fromNow()}
                    </Typography>
                </Box>
                <Box>{preview}</Box>
            </Box>
        </HoverWrapper>
    );
}
