"use client";

import MessageSent from "./Message";
import MessageForm from "./MessageForm";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import MessageContext from "@/contexts/MessageContext";
import AppBarChat from "./AppBarChat";
import useGetGroup from "@/lib/hooks/useGetGroup";
import { auth } from "@/firebase";
import { useEffect, useRef } from "react";
import { determineMessageType } from "@/lib/utils";
import svgBG from "@/assets/dribbble-kc-removebg-preview.svg";
import { Box } from "@mui/material";
import useFetchAllMessages from "@/lib/hooks/useFetchAllMessages";
import { useAllMessages } from "@/contexts/AllMessagesContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Chats({ params }: { params: { group: string } }) {
    const { messages } = useAllMessages();
    const chat_section = useRef<HTMLDivElement>(null);
    useGetGroup(params.group);
    useFetchAllMessages(params.group);

    useEffect(() => {
        if (!auth.currentUser) return;
        if (!messages.length) return;
        if (messages[messages.length - 1].sender_id !== auth.currentUser.uid) {
            chat_section.current?.scrollTo({
                top: chat_section.current.scrollHeight,
                left: 0,
                behavior: "smooth",
            });
        }
    }, [messages]);

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
