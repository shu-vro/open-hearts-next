"use client";

import { MessageType } from "@/app";
import React, { createContext, useContext, useState } from "react";

const Context = createContext({} as UseAllMessagesProps);

type UseAllMessagesProps = {
    messages: MessageType[];
    setMessages: React.Dispatch<
        React.SetStateAction<UseAllMessagesProps["messages"]>
    >;
};
export function useAllMessages() {
    return useContext(Context);
}

export default function AllMessagesContext({
    children,
}: {
    children: React.ReactNode;
}) {
    const [messages, setMessages] = useState<UseAllMessagesProps["messages"]>(
        []
    );
    return (
        <>
            <Context.Provider value={{ messages, setMessages }}>
                {children}
            </Context.Provider>
        </>
    );
}
