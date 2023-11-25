"use client";

import { cn } from "@/lib/utils";
import Avatar from "@mui/material/Avatar";
import React, { useEffect, useState } from "react";
import { AiOutlineMessage, AiOutlinePlus } from "react-icons/ai";
import { Chip, IconButton, Popover, useTheme } from "@mui/material";
import EmojiPicker, {
    EmojiStyle,
    Theme,
    EmojiClickData,
} from "emoji-picker-react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useMessage } from "@/contexts/MessageContext";
import { MessageType, TypesOfMessage, UserType } from "@/app";
import HoverWrapper, { HoverWrapperProps } from "../../HoverWrapper";
import GetEmojiLink from "./GetEmojiLink";
import DeletedMessageBox from "./DeletedMessageBox";
import { MessageBox } from "./MessageBox";
import { useGroup } from "@/contexts/GroupContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { firestoreDb } from "@/firebase";
import { DATABASE_PATH, SITEMAP } from "@/lib/variables";
import dayjs from "dayjs";

export type Props = {
    by: "me" | "him";
    type?: TypesOfMessage | null;
    msg: MessageType;
};

export function NativeHoverWrapper({
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

export default function Message({ by, type = "text", msg }: Props) {
    const { group } = useGroup();
    const [anchorElForMessagesPopover, setAnchorElForMessagesPopover] =
        useState<null | HTMLElement>(null);
    const [selectedEmoji, setSelectedEmoji] = useState("");
    const [user, setUser] = useState<UserType | null>(null);
    const {
        palette: { mode: themeMode },
    } = useTheme();
    const { setMessage } = useMessage();
    useEffect(() => {
        (async () => {
            let q = doc(
                collection(firestoreDb, DATABASE_PATH.users),
                msg.sender_id
            );
            let user = await getDoc(q);
            if (user.exists()) {
                setUser(user.data() as UserType);
            }
        })();
    }, []);
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
                    src={user?.photoURL || ""}
                    alt="shirshen shuvro"
                    component={by === "him" ? Link : "div"}
                    href={SITEMAP.profile + "/" + msg.sender_id}
                    sx={{ width: 30, height: 30 }}
                />
                {by === "him" && (
                    <span>
                        {
                            group?.groupMembersBasicDetails?.filter(
                                (e) => e.id === msg.sender_id
                            )[0].nickname
                        }
                    </span>
                )}
            </div>
            <div
                className="time justify-self-end text-xs text-gray-500"
                style={{ gridArea: "time" }}
            >
                {dayjs(msg.created_at?.seconds * 1000 || Date.now()).format(
                    "ddd, MMM D, YYYY h:mm:ss A"
                )}
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
                            setMessage((prev) => {
                                return {
                                    ...prev,
                                    reply: msg.id,
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
