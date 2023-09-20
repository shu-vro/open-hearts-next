"use client";

import { cn, normalizeTimeFormat } from "@/lib/utils";
import Avatar from "@mui/material/Avatar";
import React, { useState } from "react";
import { AiOutlineMessage, AiOutlinePlus } from "react-icons/ai";
import {
    Box,
    Chip,
    IconButton,
    ImageList,
    ImageListItem,
    Popover,
    Typography,
    useTheme,
} from "@mui/material";
import EmojiPicker, {
    EmojiStyle,
    Theme,
    EmojiClickData,
} from "emoji-picker-react";
import Link from "next/link";
import ImagePreviewModal from "./ImagePreviewModal";
import { IoMdPause } from "react-icons/io";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { RiDeleteBin6Fill, RiVoiceprintFill } from "react-icons/ri";
import { useMessage, defaultMessage } from "@/contexts/MessageContext";
import { MessageType, TypesOfMessage } from "@/app";
import HoverWrapper, { HoverWrapperProps } from "./HoverWrapper";
import { BiImages } from "react-icons/bi";
import { MdKeyboardVoice } from "react-icons/md";

type Props = {
    by: "me" | "him";
    type?: TypesOfMessage;
    msg: MessageType;
    time: number;
    avatarURL: string;
    metadata: null; // for now.
};

function NativeHoverWrapper({
    children,
    classNameInner,
    style,
    replied = false,
}: { replied?: boolean } & HoverWrapperProps) {
    return (
        <HoverWrapper
            className={cn("my-2 z-2", replied && "mt-0")}
            classNameInner={cn(classNameInner)}
            style={{
                gridArea: "message",
                ...style,
            }}
        >
            {children}
        </HoverWrapper>
    );
}

function ReplyBox({
    by,
    reply,
}: {
    by: Props["by"];
    reply: MessageType["reply"];
}) {
    return reply ? (
        <Box
            component={Link}
            href={`#${"hello"}`}
            className={cn(
                "relative py-2 px-3 rounded-lg opacity-60 cursor-pointer hover:no-underline text-inherit block mt-2 pb-5"
            )}
            sx={{
                transform: "translateY(1rem)",
                bgcolor: (theme) => theme.palette.mySwatch.messageBG,
            }}
        >
            <div className="text-xs">
                {by === "him" ? reply.to : "you"} replied to{" "}
                {by === "me" ? reply.to : "you"}
            </div>
            {reply.message.deleted ? (
                <Typography
                    noWrap
                    className="message truncate w-full text-sm p-3 rounded-lg"
                    style={{
                        maxWidth: "300px",
                        gridArea: "message",
                    }}
                >
                    This message was deleted by sender
                </Typography>
            ) : (
                <Typography
                    noWrap
                    className="message truncate w-full text-sm"
                    style={{
                        maxWidth: "300px",
                        gridArea: "message",
                    }}
                >
                    {reply.type === "text" && reply.message.text}
                    {reply.type === "image" &&
                        (reply.message.text ? (
                            <>
                                <Chip icon={<BiImages />} label="Images" /> +{" "}
                                {reply.message.text}
                            </>
                        ) : (
                            <Chip
                                icon={<BiImages />}
                                label="Replying to images"
                            />
                        ))}
                    {reply.type === "voice" && (
                        <Chip
                            icon={<MdKeyboardVoice size="20px" />}
                            label="Replying to Voice"
                        />
                    )}
                    {reply.type === "emoji" && <GetEmojiLink unified="1f601" />}
                </Typography>
            )}
        </Box>
    ) : (
        <></>
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
                className={cn(by === "me" ? "justify-self-end" : "")}
                style={{
                    gridArea: "message",
                }}
            >
                <ReplyBox by={by} reply={msg.reply} />
                <div
                    className={cn(
                        "message text-sm rounded-lg",
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
                        <div className="p-3 pt-0">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ducimus fuga quos nihil, similique voluptatem,
                            aspernatur id qui voluptatum excepturi, culpa minima
                            impedit repellat iste cum repudiandae amet eos.
                            Aliquam, a.
                        </div>
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
                <ReplyBox
                    by={by} // stupidity for now.
                    reply={msg.reply}
                />
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
            </div>
        );
    }
}

function DeletedMessageBox({
    by,
    reply,
}: {
    by: Props["by"];
    reply: MessageType["reply"];
}) {
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
            <ReplyBox
                by={by} // stupidity for now.
                reply={reply}
            />
            <NativeHoverWrapper
                replied={!!reply}
                className={cn(by === "me" && "float-right")}
            >
                <Box
                    className={cn(
                        "text-sm p-3 rounded-lg bg-[#fdeded] dark:bg-[#210b0b] text-[#5f2120] dark:text-[#f4c7c7]",
                        by === "me" ? "text-right ml-auto" : ""
                    )}
                    sx={{
                        background: (theme) =>
                            by === "him"
                                ? theme.palette.mySwatch.messageBG
                                : theme.palette.primary.main,
                    }}
                >
                    This message was deleted by sender
                </Box>
            </NativeHoverWrapper>
        </div>
    );
}

export default function Message({
    by,
    type = "text",
    msg,
    avatarURL,
    time,
    metadata, // contains user information (ALPHA)
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
                by === "me" ? "ml-auto mr-3" : ""
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
            {msg.deleted ? (
                <DeletedMessageBox by={by} reply={msg.reply} />
            ) : (
                <MessageBox by={by} type={type} msg={msg} />
            )}
            <div
                className="likes flex justify-start items-center flex-row gap-2"
                style={{ gridArea: "likes" }}
            >
                <Chip
                    icon={
                        <GetEmojiLink
                            unified="2764-fe0f"
                            size={15}
                            style={{
                                marginLeft: "4px",
                                marginRight: "-6px",
                            }}
                        />
                    }
                    label={2}
                    color="primary"
                    variant="filled"
                    clickable
                />
                <Chip
                    icon={
                        <GetEmojiLink
                            unified="1f44d"
                            size={15}
                            style={{
                                marginLeft: "4px",
                                marginRight: "-6px",
                            }}
                        />
                    }
                    label={2}
                    color="primary"
                    variant="outlined"
                    clickable
                />
                <Chip
                    icon={
                        <GetEmojiLink
                            unified="1f973"
                            size={15}
                            style={{
                                marginLeft: "4px",
                                marginRight: "-6px",
                            }}
                        />
                    }
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
                className="reply justify-self-end flex justify-center items-center flex-row"
                style={{ gridArea: "reply" }}
            >
                <HoverWrapper className="rounded-full">
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
                </HoverWrapper>
                <HoverWrapper className="rounded-full">
                    <Chip
                        icon={<RiDeleteBin6Fill size="18" />}
                        label="Delete"
                        onClick={() => {}}
                    />
                </HoverWrapper>
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
    style = {},
}: {
    unified: string;
    size?: number;
    style?: React.CSSProperties;
}) {
    return (
        <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-facebook/img/facebook/64/${unified}.png`}
                alt=""
                style={{ ...style }}
                width={size}
            />
        </>
    );
}
