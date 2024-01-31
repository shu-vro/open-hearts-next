"use client";

import MessageSent from "./Message";
import MessageForm from "./MessageForm";
import AppBarChat from "./AppBarChat";
import useGetGroup from "@/lib/hooks/useGetGroup";
import { auth } from "@/firebase";
import { useEffect, useRef, useState } from "react";
import { determineMessageType } from "@/lib/utils";
import svgBG from "@/assets/dribbble-kc-removebg-preview.svg";
import { AppBar, Box, Button, Chip, Grow, Toolbar } from "@mui/material";
import useFetchAllMessages from "@/lib/hooks/useFetchAllMessages";
import { useAllMessages } from "@/contexts/AllMessagesContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter, useSearchParams } from "next/navigation";
import { SITEMAP } from "@/lib/variables";
import { Avatar } from "@mui/material";
import { MessageType, UserType } from "@/app";
import { useUsers } from "@/contexts/UsersInGroupContext";
import Link from "next/link";

dayjs.extend(relativeTime);

export default function Chats({ params }: { params: { group: string } }) {
    const { messages } = useAllMessages();
    const { getUserById } = useUsers();
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const pinned = searchParams?.get("pinned") === "1";
    const chat_section = useRef<HTMLDivElement>(null);
    const group = useGetGroup(params.group);
    useFetchAllMessages(params.group);
    const [lastMessage, setLastMessage] = useState<MessageType | null>(null);
    const [lastMessageSender, setLastMessageSender] = useState<UserType | null>(
        null
    );

    useEffect(() => {
        if (!auth.currentUser) return push(SITEMAP.login);
        if (!messages.length) return;
        let lastMessage = messages[messages.length - 1];

        setLastMessage(
            lastMessage.sender_id !== auth.currentUser.uid ? lastMessage : null
        );
        setLastMessageSender(
            getUserById(
                lastMessage.sender_id !== auth.currentUser.uid
                    ? lastMessage.sender_id
                    : ""
            )
        );
    }, [messages]);

    useEffect(() => {
        if (!group) return;
        if (!auth.currentUser) return push(SITEMAP.login);
        if (!group.groupMembers.includes(auth.currentUser.uid)) {
            return push(SITEMAP.chats);
        }
    }, [group]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (lastMessage) {
            timeout = setTimeout(() => {
                setLastMessage(null);
            }, 4000);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [lastMessage]);

    const lastMessageType = determineMessageType(lastMessage);

    return (
        <main className="grow w-1/2 flex justify-start items-start flex-col h-full">
            <AppBarChat />
            {pinned && (
                <AppBar
                    position="static"
                    sx={{
                        bgcolor: (theme) => theme.palette.mySwatch.messageBG,
                    }}
                >
                    <Toolbar>
                        <span className="grow capitalize font-semibold ml-3 truncate">
                            Pinned Messages
                        </span>
                        <Button
                            variant="outlined"
                            size="small"
                            LinkComponent={Link}
                            href={SITEMAP.group.replace(
                                `[group]`,
                                group?.id || ""
                            )}
                        >
                            all messages
                        </Button>
                    </Toolbar>
                </AppBar>
            )}
            <div
                className="chat-section w-full overflow-y-auto h-full relative"
                id="chat_section"
                ref={chat_section}
            >
                {messages
                    .filter((msg) => {
                        return pinned ? msg.pinned : msg;
                    })
                    .map((msg, i) => (
                        <MessageSent
                            key={i}
                            by={
                                auth.currentUser?.uid === msg.sender_id
                                    ? "me"
                                    : "him"
                            }
                            type={determineMessageType(msg)}
                            msg={msg}
                        />
                    ))}
                {!messages.length && <EmptyMessage />}
            </div>
            {!pinned && (
                <Grow
                    in={!!lastMessage}
                    timeout={{
                        enter: 250,
                        appear: 500,
                        exit: 500,
                    }}
                >
                    <Chip
                        clickable
                        sx={{
                            position: "fixed",
                            left: "50%",
                            bottom: "4.5rem",
                            translate: "-50%",
                            zIndex: 1000,
                            maxWidth: "300px",
                        }}
                        label={
                            (lastMessageType === "text" && lastMessage?.text) ||
                            (lastMessageType === "image" && "image") ||
                            (lastMessageType === "voice" && "voice") ||
                            (lastMessageType === "emoji" && "emoji")
                        }
                        onClick={() => {
                            chat_section.current?.scrollTo({
                                top: chat_section.current.scrollHeight,
                                left: 0,
                                behavior: "smooth",
                            });
                        }}
                        avatar={
                            <Avatar
                                src={lastMessageSender?.photoURL || ""}
                                alt={lastMessageSender?.name || "Sender name"}
                            />
                        }
                    />
                </Grow>
            )}
            {!pinned && <MessageForm />}
        </main>
    );
}

function EmptyMessage() {
    return (
        <Box
            className="absolute top-1/2 left-1/2 w-full h-full flex justify-center items-center flex-col select-none"
            style={{
                transform: "translate(-50%, -50%)",
            }}
        >
            <object data={svgBG.src} className="w-full"></object>
            <span className="capitalize">the message box is empty</span>
        </Box>
    );
}
