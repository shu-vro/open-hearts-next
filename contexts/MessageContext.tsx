"use client";

import { IReplyMessage, MessageType } from "@/app";
import { auth } from "@/firebase";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import React, { createContext, useContext, useState } from "react";

const Context = createContext({} as UseMessageProp);

type UseMessageProp = {
    message: MessageType;
    setMessage: React.Dispatch<React.SetStateAction<MessageType>>;
    replyMessage: IReplyMessage;
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
    children: React.ReactElement;
}) {
    const [message, setMessage] = useState<UseMessageProp["message"]>({
        ...defaultMessage,
    });
    const [replyMessage, setReplyMessage] = useState<
        UseMessageProp["replyMessage"]
    >({ message: { ...defaultMessage }, type: "text", to: "shirshen shuvro" });
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
