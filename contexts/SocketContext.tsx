"use client";

import { ClientToServerEvents, ServerToClientEvents } from "@/pages/api/socket";
import { createContext, useContext, useEffect, useState } from "react";
import { type Socket, io } from "socket.io-client";

interface ISocketContext {
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}

const Context = createContext({} as ISocketContext);

export function useSocket() {
    return useContext(Context);
}

export function SocketContext({ children }: { children: React.ReactElement }) {
    const [socket, setSocket] = useState<Socket<
        ServerToClientEvents,
        ClientToServerEvents
    > | null>(null);

    useEffect(() => {
        // if (!searchParams.mode || !searchParams.groupId) {
        //     router.back();
        //     return;
        // }
        (async () => {
            if (!socket) {
                await fetch("/api/socket");
                setSocket(
                    io({
                        path: "/api/socket_io",
                    })
                );
            }
            return () => {
                if (socket) {
                    socket.disconnect();
                    setSocket(null);
                }
            };
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Context.Provider value={{ socket }}>{children}</Context.Provider>
        </>
    );
}
