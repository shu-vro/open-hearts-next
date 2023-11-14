"use client";

import MessageSent from "./Message";
import MessageForm from "./MessageForm";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import MessageContext from "@/contexts/MessageContext";
import { MessageType } from "@/app";
import AppBarChat from "./AppBarChat";
import useGetGroup from "@/lib/hooks/useGetGroup";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import { auth, firestoreDb } from "@/firebase";
import { DATABASE_PATH } from "@/lib/variables";
import { useEffect, useState } from "react";
import { determineMessageType } from "@/lib/utils";

export default function Chats({ params }: { params: { group: string } }) {
    const [messages, setMessages] = useState<MessageType[]>([]);
    useGetGroup(params.group);

    useEffect(() => {
        if (!params || !params.group) return;
        const q = query(
            collection(
                firestoreDb,
                DATABASE_PATH.groupDetails,
                params.group,
                DATABASE_PATH.messages
            ),
            orderBy("created_at" as keyof MessageType)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                setMessages(
                    snapshot.docs.map((doc) => {
                        return doc.data();
                    }) as MessageType[]
                );
            } else {
                setMessages([]);
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        console.log(messages);
    }, [messages]);

    return (
        <div className="w-full grow flex flex-row h-[calc(100%-4rem)]">
            <MessageContext>
                <>
                    <LeftSideBar />
                    <main className="grow w-1/2 flex justify-start items-start flex-col h-full">
                        <AppBarChat />
                        <div className="chat-section w-full overflow-y-auto h-full">
                            {messages.map((msg, i) => (
                                <MessageSent
                                    key={i}
                                    by={
                                        auth.currentUser?.uid === msg.sender_id
                                            ? "me"
                                            : "him"
                                    }
                                    type={determineMessageType(msg)}
                                    time={1693755271197}
                                    metadata={null}
                                    msg={msg}
                                />
                            ))}
                        </div>
                        <MessageForm />
                    </main>
                    <RightSideBar />
                </>
            </MessageContext>
        </div>
    );
}
