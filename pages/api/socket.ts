import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type { Server as HTTPServer } from "http";
import type { NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

export interface SocketServer extends HTTPServer {
    io?: IOServer | undefined;
}

export interface SocketWithIO extends NetSocket {
    server: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO;
}

export interface ServerToClientEvents {
    userServerConnection: () => void;
    sendNotif: (msg: string) => void;
    sendMsg: (msg: string, id: string) => void;
    userServerDisconnection: (socketid: string) => void;
    joinRoom: (roomid: string) => void;
    leaveRoom: (roomid: string) => void;
}

export interface ClientToServerEvents {
    sendNotif: (msg: string) => void;
    sendMsg: (msg: string, id: string) => void;
    userServerConnection: () => void;
    userServerDisconnection: (socketid: string) => void;
    joinRoom: (roomid: string) => void;
    leaveRoom: (roomid: string) => void;
}
export default function ioHandler(
    req: NextApiRequest,
    res: NextApiResponseWithSocket
) {
    const maxClients = 2;
    let activeConnections = 0;
    //  Server intialization

    if (!res.socket.server.io) {
        console.log("*First use, starting socket.io");

        const io = new Server<ServerToClientEvents, ClientToServerEvents>(
            res.socket.server,
            {
                path: "/api/socket_io",
                addTrailingSlash: false,
            }
        );

        io.on("connection", (socket) => {
            console.log("new connection", socket.id);
            // Server side Logic
            activeConnections++;
            socket.broadcast.emit("userServerConnection");
            socket.on("sendNotif", (msg) => {
                socket.emit("sendNotif", msg);
            });
            socket.on("sendMsg", (msg, id) => {
                io.to(id).emit("sendNotif", msg);
            });
            socket.on("joinRoom", async (id) => {
                await socket.join(id);
                const clientsInRoom = io.sockets.adapter.rooms.get(id);
                io.to(id).emit(
                    "sendNotif",
                    `A user joined room ${id} and ${
                        clientsInRoom ? clientsInRoom.size : 0
                    } users are here`
                );
            });
            socket.on("leaveRoom", async (id) => {
                io.to(id).emit("sendNotif", `A user left room ${id}`);
                await socket.leave(id);
            });
            socket.on("disconnect", () => {
                activeConnections--;
                console.log("A user disconnected", socket.id);
                socket.broadcast.emit("userServerDisconnection", socket.id);
            });
        });

        res.socket.server.io = io;
    } else {
        console.log("socket.io already running");
    }
    res.end();
}

export const config = {
    api: {
        bodyParser: false,
    },
};
