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

    // const msgForNow: MessageType = {
    //     emoji: "1f601",
    //     imageLink: [
    //         "https://images.unsplash.com/photo-1668162692136-9c490f102de2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
    //         "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    //         "https://images.unsplash.com/photo-1682685797857-97de838c192e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    //         "https://plus.unsplash.com/premium_photo-1666648220960-da4b99a3a17f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
    //         "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
    //         "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    //         "https://plus.unsplash.com/premium_photo-1693155671457-e97a909b5fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    //         "https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    //         "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
    //     ],
    //     text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus eius dolores adipisci dolorum libero corrupti veritatis doloremque https://tailwindcss.com/docs/responsive-design#arbitrary-values ea eaque, quis exercitationem dolorem cum nostrum error laudantium qui saepe rem unde?",
    //     voice: "",
    //     deleted: false,
    //     hash: null,
    //     reactions: {},
    //     created_at: serverTimestamp(),
    //     reply: {
    //         message: {
    //             emoji: "1f601",
    //             reactions: {},
    //             imageLink: [
    //                 "https://images.unsplash.com/photo-1668162692136-9c490f102de2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
    //                 "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    //                 "https://images.unsplash.com/photo-1682685797857-97de838c192e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    //                 "https://plus.unsplash.com/premium_photo-1666648220960-da4b99a3a17f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
    //                 "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
    //                 "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    //                 "https://plus.unsplash.com/premium_photo-1693155671457-e97a909b5fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    //                 "https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    //                 "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
    //             ],
    //             text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus eius dolores adipisci dolorum libero corrupti veritatis doloremque ea eaque, quis exercitationem dolorem cum nostrum error laudantium qui saepe rem unde?",
    //             voice: "",
    //             reply: null,
    //             deleted: false,
    //             hash: null,
    //             created_at: serverTimestamp(),
    //         },
    //         to: "shuvro",
    //         type: "text",
    //     },
    // };

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
