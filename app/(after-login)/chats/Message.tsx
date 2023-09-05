"use client";

import { cn } from "@/lib/utils";
import Avatar from "@mui/material/Avatar";
import React, { useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { Popover, useTheme } from "@mui/material";
import EmojiPicker, {
    EmojiStyle,
    Theme,
    EmojiClickData,
    Emoji,
} from "emoji-picker-react";
import Link from "next/link";
import ImagePreviewModal from "./ImagePreviewModal";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Chips from "./Chips";

type Props = {
    by: "me" | "him";
    type?: "text" | "image" | "emoji";
};

function getRandomImage() {
    let images = [
        "https://images.unsplash.com/photo-1668162692136-9c490f102de2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
        "https://images.unsplash.com/photo-1682685797857-97de838c192e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        "https://plus.unsplash.com/premium_photo-1693155671457-e97a909b5fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://plus.unsplash.com/premium_photo-1666648220960-da4b99a3a17f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
        "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
        "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        "https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    ];
    return images[Math.floor(Math.random() * images.length)];
}

function MessageBox({ by, type }: Props) {
    const {
        palette: {
            mySwatch: { messageBG },
            primary: { main },
        },
    } = useTheme();

    const [showImageModal, setShowImageModal] = useState("");
    if (type === "emoji") {
        return (
            <>
                <div
                    className={cn(
                        "message text-sm m-2 p-3 rounded-lg",
                        by === "me" ? "justify-self-end" : ""
                    )}
                    style={{
                        // TODO: afterwards, we will get how many images we have to show, then, we can tell column-count: min(3, images.length).
                        gridArea: "message",
                    }}
                >
                    <Emoji
                        unified="1f601"
                        size={50}
                        emojiStyle={EmojiStyle.FACEBOOK}
                    />
                </div>
            </>
        );
    } else if (type === "image") {
        let images = Array(10)
            .fill("")
            .map((_) => getRandomImage());

        const handleClose = () => {
            setShowImageModal("");
        };
        return (
            <div
                className={cn(
                    "message text-sm m-2 rounded-lg max-w-[70%]",
                    by === "me" ? "justify-self-end" : ""
                )}
                style={{
                    // TODO: afterwards, we will get how many images we have to show, then, we can tell column-count: min(3, images.length).
                    gridArea: "message",
                    background: by === "him" ? messageBG : main,
                    gap: 0,
                }}
            >
                <div className="columns-3 gap-0">
                    {images.map((src, i) => (
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
                        images={images}
                        handleClose={handleClose}
                        showImageModal={showImageModal}
                    />
                </div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
                fuga quos nihil, similique voluptatem, aspernatur id qui
                voluptatum excepturi, culpa minima impedit repellat iste cum
                repudiandae amet eos. Aliquam, a.
            </div>
        );
    } else {
        return (
            <div
                className={cn(
                    "message text-sm m-2 p-3 rounded-lg",
                    by === "me" ? "text-right" : ""
                )}
                style={{
                    gridArea: "message",
                    background: by === "him" ? messageBG : main,
                }}
            >
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Nesciunt provident nisi perferendis laudantium beatae inventore
                consectetur ea, nostrum soluta rerum et vero eum iste ipsum
                incidunt debitis optio recusandae molestias.
            </div>
        );
    }
}

export function MessageSent({ by, type = "text" }: Props) {
    const [anchorElForMessagesPopover, setAnchorElForMessagesPopover] =
        useState<null | HTMLElement>(null);
    const [selectedEmoji, setSelectedEmoji] = useState("");
    const {
        palette: { mode: themeMode },
    } = useTheme();
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
                    src="https://mui.com/static/images/avatar/3.jpg"
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
                {new Date(1693755271197).toLocaleString()}
            </div>
            <MessageBox by={by} type={type} />
            <div
                className="likes flex justify-start items-center flex-row gap-2"
                style={{ gridArea: "likes" }}
            >
                <Chips icon={"❤️"} text="2" selected />
                <Chips icon={"❤️"} text="2" />
                <Chips icon={"❤️"} text="2" />
                <Chips
                    icon={"➕"}
                    text=""
                    onClick={(e) => {
                        setAnchorElForMessagesPopover(e.currentTarget);
                    }}
                />
            </div>
            <div
                className="reply justify-self-end"
                style={{ gridArea: "reply" }}
            >
                <Chips icon={<AiOutlineMessage />} text="Reply" />
            </div>

            <Popover
                open={Boolean(anchorElForMessagesPopover)}
                anchorEl={anchorElForMessagesPopover}
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
