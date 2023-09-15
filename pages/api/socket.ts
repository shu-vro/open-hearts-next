import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type { Server as HTTPServer } from "http";
import type { NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";
import { nanoid } from "nanoid";

export interface SocketServer extends HTTPServer {
    io?: IOServer | undefined;
}

export interface SocketWithIO extends NetSocket {
    server: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO;
}

export interface VideoCallMessage {
    name: string;
    time: number;
    message: string;
    type: "message" | "member_info";
}

export interface ServerToClientEvents {
    userServerConnection: () => void;
    sendNotif: (msg: string) => void;
    send_msg: (data: VideoCallMessage) => void;
    userServerDisconnection: (socketid: string) => void;
    "user:join_room": (roomId: string, name: string) => void;
    "user:friend_joined_or_left_message": (data: VideoCallMessage) => void;
    "user:friend_joined": (id: string) => void;
    message: (data: VideoCallMessage) => void;
    leaveRoom: (roomId: string) => void;
}

export interface ClientToServerEvents extends ServerToClientEvents {}
export default function ioHandler(
    req: NextApiRequest,
    res: NextApiResponseWithSocket
) {
    //  Server intialization

    if (!res.socket.server.io) {
        console.log("*First use, starting socket.io");

        const io = new Server<ServerToClientEvents, ClientToServerEvents>(
            res.socket.server,
            {
                path: "/api/socket_io",
                // @ts-ignore
                addTrailingSlash: false,
            }
        );

        io.use((socket, next) => {
            // @ts-ignore
            socket.id = nanoid();
            next();
        });

        io.on("connection", (socket) => {
            console.log("new connection", socket.id);
            // Server side Logic
            socket.once("user:join_room", (roomId, name) => {
                socket.join(roomId);
                console.log(socket.id, " joined to ", roomId);
                socket.to(roomId).emit("user:friend_joined", socket.id);
                socket.to(roomId).emit("user:friend_joined_or_left_message", {
                    message: `${name} joined`,
                    time: Date.now(),
                    name,
                    type: "member_info",
                });
                socket.on("message", (msg) => {
                    io.to(roomId).emit("send_msg", msg);
                });
                socket.on("disconnect", () => {
                    io.to(roomId).emit("user:friend_joined_or_left_message", {
                        name,
                        message: `${name} left`,
                        time: Date.now(),
                        type: "member_info",
                    });
                    console.log("A user disconnected", socket.id);
                    // socket.broadcast.emit("userServerDisconnection", socket.id);
                });
            });
            // socket.broadcast.emit("userServerConnection");
            // socket.on("sendNotif", (msg) => {
            //     socket.emit("sendNotif", msg);
            // });
            // socket.on("sendMsg", (msg, id) => {
            //     io.to(id).emit("sendNotif", msg);
            // });
            // socket.on("joinRoom", async (id) => {
            //     await socket.join(id);
            //     const clientsInRoom = io.sockets.adapter.rooms.get(id);
            //     io.to(id).emit(
            //         "sendNotif",
            //         `A user joined room ${id} and ${
            //             clientsInRoom ? clientsInRoom.size : 0
            //         } users are here`
            //     );
            // });
            // socket.on("leaveRoom", async (id) => {
            //     io.to(id).emit("sendNotif", `A user left room ${id}`);
            //     await socket.leave(id);
            // });
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
