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
import HoverWrapper from "./HoverWrapper";

/**
 * TASK:
 * 1. find links
 *      1. /\b(https?|ftp|file):\/\/\S+/g
 *      2. /(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/gi
 *      3. /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/ig
 * 2. fetch the url from api ---- already done.
 * 3. add some changes to text and image types to make them compatible with an image in bottom
 */

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
        let urls = msg.text.match(
            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/gi
        );
        setUrls(urls);
    }, []);

    if (type === "voice") {
        return (
            <div
                className={cn(by === "me" ? "justify-self-end" : "")}
                style={{
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
                        sx={{
                            bgcolor: (theme) =>
                                by === "him"
                                    ? theme.palette.mySwatch.messageBG
                                    : theme.palette.primary.main,
                        }}
                    >
                        <IconButton size="small">
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
            </div>
        );
    } else if (type === "emoji") {
        let unified = "1f601";
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
                    <GetEmojiLink unified={unified} />
                </div>
            </div>
        );
    } else if (type === "image") {
        const handleClose = () => {
            setShowImageModal("");
        };
        return (
            <div
                className={cn(by === "me" ? "justify-self-end" : "")}
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
                            // TODO: afterwards, we will get how many images we have to show, then, we can tell column-count: min(3, images.length).
                            background: (theme) =>
                                by === "him"
                                    ? theme.palette.mySwatch.messageBG
                                    : theme.palette.primary.main,
                            gap: 0,
                        }}
                    >
                        <ImageList
                            variant="masonry"
                            cols={3}
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
                        <div className="p-3 pt-0">{msg.text}</div>
                    </Box>
                </NativeHoverWrapper>
            </div>
        );
    } else {
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
                        }}
                    >
                        {msg.text}
                    </Box>
                </NativeHoverWrapper>
                <div className="flex justify-start items-center flex-wrap gap-1.5">
                    {urls?.map((url, i) => (
                        <WebsiteInfoCard url={url} key={i} />
                    ))}
                </div>
            </div>
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
                setMetadata(data.data);
            } catch (error) {
                console.info(error);
            }
        })();
    }, []);
    return metadata ? (
        <HoverWrapper className="mb-2">
            <Box
                className="text-inherit hover:no-underline grid overflow-hidden"
                component="a"
                href={url}
                target="_blank"
                sx={{
                    width: `clamp(200px, 250px, 300px)`,
                    gridTemplateAreas: `
                        'icon ${repeat("title", 50)} title'
                        'icon ${repeat("url", 50)}   url'
                        'poster ${repeat("poster", 50)} poster'
                        `,
                }}
            >
                <Avatar
                    sx={{
                        gridArea: "icon",
                    }}
                    src={new URL(url).origin + metadata.favicon}
                    alt={new URL(url).host}
                />
                <Typography noWrap gridArea="title">
                    {metadata.ogTitle || url}
                </Typography>
                <Typography noWrap gridArea="url">
                    {url}
                </Typography>
                <img
                    src={metadata?.ogImage?.[0].url || ""}
                    alt="website poster"
                    style={{
                        display: metadata?.ogImage?.[0]?.url ? "block" : "none",
                        gridArea: "poster",
                        width: `clamp(200px, 250px, 300px)`,
                    }}
                />
            </Box>
        </HoverWrapper>
    ) : (
        <></>
    );
}
