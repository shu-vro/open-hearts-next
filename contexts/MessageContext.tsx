"use client";

import { MessageType } from "@/app";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import { nanoid } from "nanoid";
import React, { createContext, useContext, useState } from "react";

const Context = createContext({} as UseMessageProp);

type UseMessageProp = {
    message: MessageType;
    setMessage: React.Dispatch<React.SetStateAction<MessageType>>;
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
    return (
        <>
            <Context.Provider value={{ message, setMessage }}>
                {children}
            </Context.Provider>
        </>
    );
}

export const defaultMessage = Object.freeze({
    id: nanoid(),
    emoji: "",
    text: "",
    imageLink: [],
    voice: "",
    deleted: false,
    reportCount: 0,
    reply: null,
    reactions: {},
    created_at: serverTimestamp() as Timestamp,
    sender_id: "",
    info: "",
} as MessageType);
