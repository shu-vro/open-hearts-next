"use client";

import { cn, repeat } from "@/lib/utils";
import { Avatar, Box, Typography } from "@mui/material";
import HoverWrapper from "../HoverWrapper";
import { OgObject } from "open-graph-scraper/dist/lib/types";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function SharedLink({ link }: { link: string }) {
    const [timeDiff, setTimeDiff] = useState(dayjs(1694720446951).fromNow());
    const [preview, setPreview] = useState(<></>);
    useEffect(() => {
        (async () => {
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
            if (json.error) {
                setPreview(
                    <Typography
                        noWrap
                        // variant="body2"
                        sx={{
                            color: (theme) => theme.palette.primary.main,
                        }}
                    >
                        {link}
                    </Typography>
                );
            } else {
                const { favicon, ogTitle, ogDescription } = json.data;

                setPreview(
                    <Box className="flex flex-row justify-start items-center w-full">
                        {favicon && (
                            <img
                                src={link + favicon}
                                alt={link}
                                style={{
                                    width: "5rem",
                                }}
                            />
                        )}
                        <Box className="w-full">
                            <span className="hidden">&nbsp;</span>
                            {ogTitle && (
                                <Typography variant="body1" className="text-lg">
                                    {ogTitle}
                                </Typography>
                            )}
                            <Typography
                                noWrap
                                variant="body2"
                                sx={{
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
                                >
                                    {ogDescription}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                );
            }
        })();
    }, []);

    return (
        <HoverWrapper className="my-1.5 mx-4 w-[calc(100%-2rem)]">
            <Box
                component="a"
                href={link}
                target="_blank"
                className="grid p-2 text-inherit hover:no-underline"
                sx={{
                    /**
                     * logic:
                     * avatar, name {n times} time {n+1 times}
                     * message {n * 2 + 2 times}
                     * where n >= 0
                     */
                    gridTemplateAreas: `
                        'avatar ${repeat("name   ", 50)} ${repeat("time", 51)}'
                        '${repeat("message", 102)}'
                        `,
                }}
            >
                <Avatar
                    src={link}
                    alt={link}
                    sx={{
                        gridArea: "avatar",
                    }}
                    className={cn("self-center mr-2 w-11 h-11")}
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
                <Box
                    sx={{
                        gridArea: "message",
                    }}
                >
                    {preview}
                </Box>
            </Box>
        </HoverWrapper>
    );
}
