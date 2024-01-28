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
import { Box, Chip } from "@mui/material";
import useFetchAllMessages from "@/lib/hooks/useFetchAllMessages";
import { useAllMessages } from "@/contexts/AllMessagesContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import { SITEMAP } from "@/lib/variables";
import { Avatar } from "@mui/material";

dayjs.extend(relativeTime);

export default function Chats({ params }: { params: { group: string } }) {
    const { messages } = useAllMessages();
    const { push } = useRouter();
    const chat_section = useRef<HTMLDivElement>(null);
    const group = useGetGroup(params.group);
    useFetchAllMessages(params.group);
    const [lastMessage, setLastMessage] = useState({ ...defaultMessage });

    useEffect(() => {
        if (!auth.currentUser) return push(SITEMAP.login);
        if (!messages.length) return;
        if (messages[messages.length - 1].sender_id !== auth.currentUser.uid) {
            chat_section.current?.scrollTo({
                top: chat_section.current.scrollHeight,
                left: 0,
                behavior: "smooth",
            });
        }
        setLastMessage(messages[messages.length - 1]);
    }, [messages]);

    useEffect(() => {
        if (!group) return;
        if (!auth.currentUser) return push(SITEMAP.login);
        if (!group.groupMembers.includes(auth.currentUser.uid)) {
            return push(SITEMAP.chats);
        }
    }, [group]);

    const lastMessageType = determineMessageType(lastMessage);

    return (
        <div className="w-full grow flex flex-row h-[calc(100%-4rem)]">
            <MessageContext>
                <LeftSideBar />
                <main className="grow w-1/2 flex justify-start items-start flex-col h-full">
                    <AppBarChat />
                    <div
                        className="chat-section w-full overflow-y-auto h-full relative"
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
                        <Chip
                            sx={{
                                position: "fixed",
                                left: "50%",
                                bottom: "4.5rem",
                                transform: "translateX(-50%)",
                                zIndex: 1000,
                            }}
                            clickable
                            label={
                                (lastMessageType === "text" &&
                                    lastMessage.text) ||
                                (lastMessageType === "image" && "image") ||
                                (lastMessageType === "voice" && "voice") ||
                                (lastMessageType === "emoji" && "emoji")
                            }
                            onClick={() => {}}
                            avatar={
                                <Avatar
                                    src="https://mui.com/static/images/avatar/1.jpg"
                                    alt="Shuvro"
                                />
                            }
                        />
                    </div>
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
