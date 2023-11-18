"use client";
import { cn, normalizeTimeFormat, repeat } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    IconButton,
    ImageList,
    ImageListItem,
    Typography,
} from "@mui/material";
import ImagePreviewModal from "./ImagePreviewModal";
import { IoMdPause } from "react-icons/io";
import { RiVoiceprintFill } from "react-icons/ri";
import GetEmojiLink from "./GetEmojiLink";
import ReplyBox from "./ReplyBox";
import { Props, NativeHoverWrapper } from "./Message";
import { OgObject } from "open-graph-scraper/dist/lib/types";
import HoverWrapper from "../../HoverWrapper";
import { sanitize } from "isomorphic-dompurify";
import { URL_REGEX } from "@/lib/utils";

function DangerousHtml(text: string, array: string[] = []) {
    let result = text;
    for (let i = 0; i < array.length; i++) {
        result = result.replaceAll(
            array[i],
            `<a href="${array[i]}" target="_blank" rel="noopener noreferrer">${array[i]}</a>`
        );
    }
    return sanitize(result, {
        ALLOWED_TAGS: ["a"],
        ALLOWED_ATTR: ["href", "target", "rel"],
    });
}

export function MessageBox({
    by,
    type,
    msg,
}: {
    by: Props["by"];
    type: Props["type"];
    msg: Props["msg"];
}) {
    const [voiceMessageDone, setVoiceMessageDone] = useState(0);
    const [showImageModal, setShowImageModal] = useState("");
    const [urls, setUrls] = useState<RegExpMatchArray | null>(null);
    useEffect(() => {
        let urls = msg.text.match(URL_REGEX);
        setUrls(urls);
    }, []);

    if (type === "voice") {
        return (
            <Box
                className={cn(by === "me" ? "justify-self-end" : "")}
                sx={{
                    gridArea: "message",
                }}
            >
                <ReplyBox by={by} reply={msg.reply} />
                <NativeHoverWrapper replied={!!msg.reply}>
                    <Box
                        className={cn(
                            "message text-sm p-3 rounded-[inherit] flex justify-center items-center flex-row gap-2",
                            by === "me" && "float-right"
                        )}
                        bgcolor="mySwatch.messageBG"
                        sx={{
                            bgcolor: (theme) =>
                                by === "him"
                                    ? theme.palette.mySwatch.messageBG
                                    : theme.palette.primary.main,
                            color: (theme) =>
                                by === "me"
                                    ? theme.palette.getContrastText(
                                          theme.palette.primary.main
                                      )
                                    : "inherit",
                        }}
                    >
                        <IconButton
                            size="small"
                            sx={{
                                color: (theme) =>
                                    by === "me"
                                        ? theme.palette.getContrastText(
                                              theme.palette.primary.main
                                          )
                                        : "inherit",
                            }}
                        >
                            <IoMdPause />
                        </IconButton>
                        <span className="start font-bold">
                            {normalizeTimeFormat(0)}
                        </span>
                        <div
                            className="relative text-3xl max-[865px]:text-2xl overflow-hidden"
                            onClick={(e) => {
                                let rect =
                                    e.currentTarget.getBoundingClientRect();
                                setVoiceMessageDone(
                                    ((e.clientX - rect.x) / rect.width) * 100
                                );
                            }}
                        >
                            <div className="base opacity-40 flex justify-center items-center flex-row">
                                {Array(6)
                                    .fill("")
                                    .map((_, i) => (
                                        <RiVoiceprintFill key={i} />
                                    ))}
                            </div>
                            <div
                                className="slider absolute top-0 left-0 w-full h-full"
                                style={{
                                    clipPath: `polygon(0 0, ${voiceMessageDone}% 0, ${voiceMessageDone}% 100%, 0% 100%)`,
                                }}
                            >
                                {Array(6)
                                    .fill("")
                                    .map((_, i) => (
                                        <RiVoiceprintFill key={i} />
                                    ))}
                            </div>
                        </div>
                        <span className="end font-bold">
                            {normalizeTimeFormat(400)}
                        </span>
                    </Box>
                </NativeHoverWrapper>
            </Box>
        );
    } else if (type === "emoji") {
        return (
            <div
                className={cn(
                    "flex justify-start flex-col",
                    by === "me" ? "items-end" : "items-start"
                )}
                style={{
                    gridArea: "message",
                }}
            >
                <ReplyBox by={by} reply={msg.reply} />
                <div
                    className={cn(
                        "message text-sm rounded-lg z-10",
                        by === "me" ? "float-right" : ""
                    )}
                >
                    <GetEmojiLink unified={msg.emoji || "1f44d"} />
                </div>
            </div>
        );
    } else if (type === "image") {
        const handleClose = () => {
            setShowImageModal("");
        };
        return (
            <div
                className={cn(
                    "flex justify-start flex-col",
                    by === "me" ? "justify-self-end items-end" : "items-start"
                )}
                style={{
                    gridArea: "message",
                }}
            >
                <ReplyBox
                    by={by} // stupidity for now.
                    reply={msg.reply}
                />
                <NativeHoverWrapper
                    replied={!!msg.reply}
                    style={{
                        width: "70%",
                        float: by === "me" ? "right" : undefined,
                    }}
                >
                    <Box
                        className={cn(
                            "message text-sm rounded-lg",
                            by === "me" ? "justify-self-end" : ""
                        )}
                        sx={{
                            color: (theme) =>
                                by === "me"
                                    ? theme.palette.getContrastText(
                                          theme.palette.primary.main
                                      )
                                    : "inherit",
                            gap: 0,
                        }}
                    >
                        <ImageList
                            variant="masonry"
                            cols={Math.min(3, msg.imageLink.length)}
                            gap={8}
                            className="mt-0 rounded-[inherit]"
                        >
                            {msg.imageLink.map((src, i) => (
                                <ImageListItem
                                    key={i}
                                    component="a"
                                    href={`#${i + 1}`}
                                    onClick={() => {
                                        setShowImageModal(i.toString());
                                    }}
                                >
                                    <img
                                        src={`${src}?w=248&fit=crop&auto=format`}
                                        srcSet={`${src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        alt={src}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            ))}
                            <ImagePreviewModal
                                images={msg.imageLink}
                                handleClose={handleClose}
                                showImageModal={showImageModal}
                            />
                        </ImageList>
                        <Box
                            className="p-3 rounded-lg rounded-t-none"
                            sx={{
                                background: (theme) =>
                                    by === "him"
                                        ? theme.palette.mySwatch.messageBG
                                        : theme.palette.primary.main,
                                "& > a": {
                                    color: "inherit",
                                    textDecoration: "underline",
                                },
                            }}
                            dangerouslySetInnerHTML={{
                                __html: DangerousHtml(msg.text, urls || []),
                            }}
                        ></Box>
                    </Box>
                </NativeHoverWrapper>

                <div
                    className={cn(
                        "flex items-start flex-wrap gap-1.5",
                        by === "me" ? "justify-end" : "justify-start"
                    )}
                >
                    {urls?.map((url, i) => (
                        <WebsiteInfoCard url={url} key={i} />
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <Box
                className={cn(
                    "flex justify-start flex-col",
                    by === "me" ? "items-end" : "items-start"
                )}
                style={{
                    gridArea: "message",
                }}
            >
                <ReplyBox by={by} reply={msg.reply} />
                <NativeHoverWrapper replied={!!msg.reply}>
                    <Box
                        className={cn(
                            "message text-sm p-3 rounded-lg",
                            by === "me" && "text-right"
                        )}
                        sx={{
                            background: (theme) =>
                                by === "him"
                                    ? theme.palette.mySwatch.messageBG
                                    : theme.palette.primary.main,

                            color: (theme) =>
                                by === "me"
                                    ? theme.palette.getContrastText(
                                          theme.palette.primary.main
                                      )
                                    : "inherit",

                            "& > a": {
                                color: "inherit",
                                textDecoration: "underline",
                            },
                        }}
                        dangerouslySetInnerHTML={{
                            __html: DangerousHtml(msg.text, urls || []),
                        }}
                    ></Box>
                </NativeHoverWrapper>
                <div
                    className={cn(
                        "flex items-start flex-wrap gap-1.5",
                        by === "me" ? "justify-end" : "justify-start"
                    )}
                >
                    {urls?.map((url, i) => (
                        <WebsiteInfoCard url={url} key={i} />
                    ))}
                </div>
            </Box>
        );
    }
}

function WebsiteInfoCard({ url }: { url: string }) {
    const [metadata, setMetadata] = useState<OgObject | null>(null);
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/chats/api", {
                    method: "post",
                    body: JSON.stringify({
                        url: url,
                        get: ["favicon", "ogDescription", "ogTitle", "ogImage"],
                    } as { url: string; get: (keyof OgObject)[] }),
                });
                let data = await res.json();
                if (typeof data.data !== "object") return;
                if (data.error) return;

                if (data.data.favicon) {
                    if (!data.data.favicon.match(URL_REGEX)) {
                        data.data.favicon =
                            new URL(url)?.origin + data.data.favicon ||
                            data.data.ogTitle;
                    }
                }
                setMetadata(data.data);
            } catch (error) {
                console.info(error);
            }
        })();
    }, []);
    return metadata ? (
        <HoverWrapper className="mb-2">
            <Box
                className="text-inherit hover:no-underline grid overflow-hidden max-w-xs w-full p-2"
                component="a"
                href={url}
                target="_blank"
                title={url}
                sx={{
                    gridTemplateAreas: `
                        'icon ${repeat("title", 50)} title'
                        'icon ${repeat("url", 50)}   url'
                        'poster ${repeat("poster", 50)} poster'
                        '${repeat("description", 52)}'
                        `,
                }}
            >
                <Avatar
                    sx={{
                        display: metadata?.favicon ? "block" : "none",
                        gridArea: "icon",
                    }}
                    src={metadata.favicon}
                    alt={new URL(url)?.host}
                />
                <Typography noWrap gridArea="title">
                    {metadata.ogTitle || url}
                </Typography>
                <Typography
                    noWrap
                    gridArea="url"
                    display={metadata?.ogImage?.[0]?.url ? "block" : "none"}
                >
                    {url}
                </Typography>
                <img
                    className="w-full mb-1"
                    src={metadata?.ogImage?.[0].url || ""}
                    alt="website poster"
                    style={{
                        display: metadata?.ogImage?.[0]?.url ? "block" : "none",
                        gridArea: "poster",
                    }}
                />
                <Typography
                    className="line-clamp-2 opacity-60"
                    gridArea="description"
                    display={metadata?.ogDescription ? "block" : "none"}
                >
                    {metadata.ogDescription || ""}
                </Typography>
            </Box>
        </HoverWrapper>
    ) : (
        <></>
    );
}
