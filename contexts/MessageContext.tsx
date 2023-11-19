"use client";

import { MessageType } from "@/app";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import React, { createContext, useContext, useState } from "react";

const Context = createContext({} as UseMessageProp);

type UseMessageProp = {
    message: MessageType;
    setMessage: React.Dispatch<React.SetStateAction<MessageType>>;
    replyMessage: string | null;
    setReplyMessage: React.Dispatch<
        React.SetStateAction<UseMessageProp["replyMessage"]>
    >;
};
export function useMessage() {
    return useContext(Context);
}

export default function MessageContext({
    children,
}: {
    children: React.ReactNode;
}) {
    const [message, setMessage] = useState<UseMessageProp["message"]>({
        ...defaultMessage,
    });
    const [replyMessage, setReplyMessage] =
        useState<UseMessageProp["replyMessage"]>("");
    return (
        <>
            <Context.Provider
                value={{ message, setMessage, replyMessage, setReplyMessage }}
            >
                {children}
            </Context.Provider>
        </>
    );
}

export const defaultMessage = Object.freeze({
    id: "",
    emoji: "",
    text: "",
    imageLink: [],
    voice: "",
    deleted: false,
    hash: null,
    reply: null,
    reactions: {},
    created_at: serverTimestamp() as Timestamp,
    sender_id: "",
} as MessageType);
