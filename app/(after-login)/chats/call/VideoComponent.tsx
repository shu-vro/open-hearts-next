"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import VideoCallDrawer from "./VideoCallDrawer";
import Peer from "peerjs";
import { io, type Socket } from "socket.io-client";
import { Toolbar } from "@mui/material";
import { ClientToServerEvents, ServerToClientEvents } from "@/pages/api/socket";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

const drawerWidth = 320;

export default function VideoComponent() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [peer, setPeer] = React.useState(new Peer({}));
    const myVideo = React.useRef<HTMLVideoElement>(null);
    const hisVideo = React.useRef<HTMLVideoElement>(null);
    React.useEffect(() => {
        if (!socket) {
            void fetch("/api/socket");
            socket = io(undefined, {
                path: "/api/socket_io",
            });

            console.log(socket);

            socket.on("connect", () => {
                console.log("connected");
            });

            socket.on("sendNotif", (msg) => {
                console.log(msg);
            });
            socket.on("userServerConnection", () => {
                console.log("a user connected (client)");
            });

            socket.on("userServerDisconnection", (socketid: string) => {
                console.log(socketid);
            });
        }
        return () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        };
    }, []);

    React.useEffect(() => {
        // (async () => {
        //     let mediaStream = await navigator.mediaDevices.getUserMedia({
        //         video: true,
        //         audio: true,
        //     });
        //     myVideo.current!.srcObject = mediaStream;
        //     console.log(peer);
        //     peer.on("open", function (id) {
        //         console.log("My peer ID is: " + id);
        //     });
        //     peer.on("call", (call) => {
        //         call.answer(mediaStream);
        //         call.on("stream", (stream) => {
        //             hisVideo.current!.srcObject = stream;
        //         });
        //     });
        //     let otherId = prompt("another id: ");
        //     // let otherId = "";
        //     if (otherId) {
        //         let call = peer.call(otherId, mediaStream);
        //         call.on("stream", (stream) => {
        //             hisVideo.current!.srcObject = stream;
        //         });
        //     }
        // })();
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box className="w-full">
            {/* <Script src="/socket.io/socket.io.js" /> */}
            <AppBar position="static" className="text-white">
                <Toolbar className="gap-3">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        className="p-3"
                        onClick={handleDrawerToggle}
                    >
                        <BsFillChatLeftTextFill />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Video Call
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    anchor="right"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: "block",
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    <VideoCallDrawer />
                </Drawer>
            </Box>
            <Box component="main" className="grow p-3 w-full h-full">
                <div className="videos flex justify-center items-center flex-wrap w-full">
                    <video
                        ref={myVideo}
                        style={{
                            width: "50%",
                            height: "150%",
                            border: "1px solid red",
                            transform: "rotateY(180deg)",
                        }}
                        autoPlay
                        loop
                        // controls
                    ></video>
                    <video
                        ref={hisVideo}
                        style={{
                            width: "50%",
                            height: "150%",
                            border: "1px solid red",
                            transform: "rotateY(180deg)",
                        }}
                        autoPlay
                        loop
                        // controls
                    ></video>
                    {/* {Array(1)
                        .fill("")
                        .map((_, i) => (
                            <video
                                key={i}
                                src="https://www.pexels.com/download/video/1321208/"
                                style={{
                                    width: "50%",
                                    height: "150%",
                                    border: "1px solid red",
                                }}
                                autoPlay
                                loop
                                // controls
                            ></video>
                        ))} */}
                </div>
            </Box>
        </Box>
    );
}
