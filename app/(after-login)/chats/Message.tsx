"use client";

import { cn, normalizeTimeFormat } from "@/lib/utils";
import Avatar from "@mui/material/Avatar";
import React, { useState } from "react";
import { AiOutlineMessage, AiOutlinePlus } from "react-icons/ai";
import { Box, Chip, IconButton, Popover, useTheme } from "@mui/material";
import EmojiPicker, {
    EmojiStyle,
    Theme,
    EmojiClickData,
} from "emoji-picker-react";
import Link from "next/link";
import ImagePreviewModal from "./ImagePreviewModal";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { RiVoiceprintFill } from "react-icons/ri";
import {
    useMessage,
    defaultMessage,
    TypesOfMessage,
} from "@/contexts/MessageContext";
import { MessageType } from "@/app";
import HoverWrapper from "./HoverWrapper";

type Props = {
    by: "me" | "him";
    type?: TypesOfMessage;
    msg: MessageType;
    time: number;
    avatarURL: string;
    metadata: null; // for now.
};

function NativeHoverWrapper({ children }: { children: React.ReactElement }) {
    return (
        <HoverWrapper
            className="my-2"
            style={{
                gridArea: "message",
            }}
        >
            {children}
        </HoverWrapper>
    );
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
    if (type === "voice") {
        return (
            <NativeHoverWrapper>
                <Box
                    className={cn(
                        "message text-sm p-3 rounded-lg flex justify-center items-center flex-row gap-2",
                        by === "me" ? "justify-self-end" : ""
                    )}
                    sx={{
                        bgcolor: (theme) =>
                            by === "him"
                                ? theme.palette.mySwatch.messageBG
                                : theme.palette.primary.main,
                    }}
                >
                    <span className="start font-bold">
                        {normalizeTimeFormat(0)}
                    </span>
                    <div
                        className="relative text-3xl max-[865px]:text-2xl overflow-hidden"
                        onClick={(e) => {
                            let rect = e.currentTarget.getBoundingClientRect();
                            setVoiceMessageDone(
                                ((e.clientX - rect.x) / rect.width) * 100
                            );
                        }}
                    >
                        <div className="base opacity-40">
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
        );
    } else if (type === "emoji") {
        let unified = "1f601";
        return (
            <>
                <div
                    className={cn(
                        "message text-sm m-2 p-3 rounded-lg",
                        by === "me" ? "justify-self-end" : ""
                    )}
                    style={{
                        gridArea: "message",
                    }}
                >
                    <GetEmojiLink unified={unified} />
                </div>
            </>
        );
    } else if (type === "image") {
        const handleClose = () => {
            setShowImageModal("");
        };
        return (
            <NativeHoverWrapper>
                <Box
                    className={cn(
                        "message text-sm rounded-lg",
                        by === "me" ? "justify-self-end" : ""
                    )}
                    sx={{
                        // TODO: afterwards, we will get how many images we have to show, then, we can tell column-count: min(3, images.length).
                        gridArea: "message",
                        background: (theme) =>
                            by === "him"
                                ? theme.palette.mySwatch.messageBG
                                : theme.palette.primary.main,
                        gap: 0,
                    }}
                >
                    <div className="columns-3 gap-0">
                        {msg.imageLink.map((src, i) => (
                            <a
                                href={`#${i + 1}`}
                                key={i}
                                onClick={() => {
                                    setShowImageModal(i.toString());
                                }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={src}
                                    alt={src}
                                    className="break-inside-avoid w-full"
                                />
                            </a>
                        ))}
                        <ImagePreviewModal
                            images={msg.imageLink}
                            handleClose={handleClose}
                            showImageModal={showImageModal}
                        />
                    </div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ducimus fuga quos nihil, similique voluptatem, aspernatur id
                    qui voluptatum excepturi, culpa minima impedit repellat iste
                    cum repudiandae amet eos. Aliquam, a.
                </Box>
            </NativeHoverWrapper>
        );
    } else {
        return (
            <NativeHoverWrapper>
                <Box
                    className={cn(
                        "message text-sm p-3 rounded-lg",
                        by === "me" ? "text-right" : ""
                    )}
                    sx={{
                        gridArea: "message",
                        background: (theme) =>
                            by === "him"
                                ? theme.palette.mySwatch.messageBG
                                : theme.palette.primary.main,
                    }}
                >
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Nesciunt provident nisi perferendis laudantium beatae
                    inventore consectetur ea, nostrum soluta rerum et vero eum
                    iste ipsum incidunt debitis optio recusandae molestias.
                </Box>
            </NativeHoverWrapper>
        );
    }
}

export default function Message({
    by,
    type = "text",
    msg,
    avatarURL,
    time,
    metadata,
}: Props) {
    const [anchorElForMessagesPopover, setAnchorElForMessagesPopover] =
        useState<null | HTMLElement>(null);
    const [selectedEmoji, setSelectedEmoji] = useState("");
    const {
        palette: { mode: themeMode },
    } = useTheme();
    const { setReplyMessage, setMessage } = useMessage();
    return (
        <div
            className={cn(
                "grid w-fit max-w-[80%] pl-4 my-4",
                by === "me" ? "ml-auto" : ""
            )}
            style={{
                gridTemplateAreas:
                    by === "him"
                        ? `
                        'name    name       time'
                        'message message message'
                        'likes   likes      reply'
                        `
                        : `
                        'time    name       name'
                        'message message message'
                        'likes   likes      reply'
                        `,
            }}
        >
            <div
                className={cn(
                    "name flex justify-start items-center flex-row gap-2",
                    by === "me" ? "justify-self-end" : ""
                )}
                style={{ gridArea: "name" }}
            >
                <Avatar
                    src={avatarURL}
                    alt="shirshen shuvro"
                    component={by === "him" ? Link : "div"}
                    href="#profile"
                    sx={{ width: 30, height: 30 }}
                />
                {by === "him" && <span>lorem ipsum</span>}
            </div>
            <div
                className="time justify-self-end text-xs text-gray-500"
                style={{ gridArea: "time" }}
            >
                {new Date(time).toLocaleString()}
            </div>
            <MessageBox by={by} type={type} msg={msg} />
            <div
                className="likes flex justify-start items-center flex-row gap-2"
                style={{ gridArea: "likes" }}
            >
                <Chip
                    icon={<span>❤️</span>}
                    label={2}
                    color="primary"
                    variant="filled"
                    clickable
                />
                <Chip
                    icon={<span>❤️</span>}
                    label={2}
                    color="primary"
                    variant="outlined"
                    clickable
                />
                <Chip
                    icon={<span>❤️</span>}
                    label={2}
                    color="primary"
                    variant="outlined"
                    clickable
                />
                <IconButton
                    onClick={(e) => {
                        setAnchorElForMessagesPopover(e.currentTarget);
                    }}
                    size="small"
                    color="primary"
                    sx={{
                        border: "1px solid currentcolor",
                    }}
                >
                    <AiOutlinePlus />
                </IconButton>
            </div>
            <div
                className="reply justify-self-end"
                style={{ gridArea: "reply" }}
            >
                <Chip
                    icon={<AiOutlineMessage />}
                    label="Reply"
                    onClick={() => {
                        setReplyMessage({
                            type,
                            to: "shirshen dada",
                            message: {
                                ...defaultMessage,
                                text: "shuvro is the best",
                            },
                        });
                        setMessage((prev) => {
                            return {
                                ...prev,
                                reply: {
                                    message: msg,
                                    to: "shirshen dada",
                                    type,
                                },
                            };
                        });
                    }}
                />
            </div>

            <Popover
                open={Boolean(anchorElForMessagesPopover)}
                anchorEl={anchorElForMessagesPopover}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                onClose={() => setAnchorElForMessagesPopover(null)}
            >
                <EmojiPicker
                    onEmojiClick={(
                        emojiData: EmojiClickData,
                        event: MouseEvent
                    ) => {
                        setSelectedEmoji(emojiData.unified);
                        setAnchorElForMessagesPopover(null);
                        console.log(emojiData);
                    }}
                    autoFocusSearch={false}
                    theme={themeMode as Theme}
                    searchPlaceHolder="Filter "
                    emojiStyle={EmojiStyle.FACEBOOK}
                />
            </Popover>
        </div>
    );
}
export function GetEmojiLink({
    unified,
    size = 50,
}: {
    unified: string;
    size?: number;
}) {
    return (
        <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-facebook/img/facebook/64/${unified}.png`}
                alt=""
                width={size}
            />
        </>
    );
}
