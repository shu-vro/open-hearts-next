"use client";

import MessageSent from "./Message";
import MessageForm from "./MessageForm";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import MessageContext, { defaultMessage } from "@/contexts/MessageContext";
import AppBarChat from "./AppBarChat";
import useGetGroup from "@/lib/hooks/useGetGroup";
import { auth } from "@/firebase";
import { useEffect, useRef, useState } from "react";
import { determineMessageType } from "@/lib/utils";
import svgBG from "@/assets/dribbble-kc-removebg-preview.svg";
import { Box, Chip, Fade, Grow } from "@mui/material";
import useFetchAllMessages from "@/lib/hooks/useFetchAllMessages";
import { useAllMessages } from "@/contexts/AllMessagesContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import { SITEMAP } from "@/lib/variables";
import { Avatar } from "@mui/material";
import { MessageType, UserType } from "@/app";
import { useUsers } from "@/contexts/UsersInGroupContext";

dayjs.extend(relativeTime);

export default function Chats({ params }: { params: { group: string } }) {
    const { messages } = useAllMessages();
    const { getUserById } = useUsers();
    const { push } = useRouter();
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
        // if (lastMessage.sender_id === auth.currentUser.uid) {
        //     chat_section.current?.scrollTo({
        //         top: chat_section.current.scrollHeight,
        //         left: 0,
        //         behavior: "smooth",
        //     });
        // }

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
        <div className="w-full grow flex flex-row h-[calc(100%-4rem)]">
            <MessageContext>
                <LeftSideBar />
                <main className="grow w-1/2 flex justify-start items-start flex-col h-full">
                    <AppBarChat />
                    <div
                        className="chat-section w-full overflow-y-auto h-full relative"
                        id="chat_section"
                        ref={chat_section}
                    >
                        {messages.map((msg, i) => (
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
                            }}
                            label={
                                (lastMessageType === "text" &&
                                    lastMessage?.text) ||
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
                                    alt={
                                        lastMessageSender?.name || "Sender name"
                                    }
                                />
                            }
                        />
                    </Grow>
                    <MessageForm />
                </main>
                <RightSideBar messages={messages} />
            </MessageContext>
        </div>
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
