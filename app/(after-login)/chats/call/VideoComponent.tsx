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
import { Toolbar } from "@mui/material";
import { useSocket } from "@/contexts/SocketContext";

const drawerWidth = 320;

type VideoElementProps = {
    srcObject: MediaStream | MediaSource;
} & React.HTMLProps<HTMLVideoElement>;

function VideoElement({ srcObject, ...rest }: VideoElementProps) {
    const video = React.useRef<HTMLVideoElement>(null);
    React.useEffect(() => {
        if (video.current) {
            video.current.srcObject = srcObject;
        }
    }, [srcObject]);

    return (
        <video
            style={{
                width: "50%",
                height: "150%",
                border: "1px solid red",
                transform: "rotateY(180deg)",
            }}
            autoPlay
            loop
            ref={video}
            {...rest}
            // controls
        ></video>
    );
}

export default function VideoComponent() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [peer, setPeer] = React.useState<Peer | null>();
    const [Videos, setVideos] = React.useState<{
        [x: string]: VideoElementProps;
    }>({});
    const [socketDoneOnce, setSocketDoneOnce] = React.useState(false);
    const { socket } = useSocket();

    React.useEffect(() => {
        if (!socket) return;

        if (!peer) {
            socket?.on("connect", () => {
                setPeer(new Peer(socket?.id, {}));
            });
            return;
        }
        if (socketDoneOnce) {
            return;
        }
        // (async () => {
        //     let mediaStream = await navigator.mediaDevices.getUserMedia({
        //         video: true,
        //         audio: true,
        //     });
        //     // myVideo.current!.srcObject = mediaStream;
        //     setVideos((prev) => {
        //         prev.push({ srcObject: mediaStream, muted: true });
        //         return [...prev];
        //     });
        //     // document.getElementById("my_video").srcObject = mediaStream;
        //     peer.on("open", function (id) {
        //         console.log("My peer ID is: " + id);
        //         peer.on("call", (call) => {
        //             console.log(call.connectionId);
        //             call.answer(mediaStream);
        //             call.on("stream", (stream) => {
        //                 setVideos((prev) => {
        //                     prev.push({ srcObject: stream });
        //                     return [...prev];
        //                 });
        //             });
        //         });
        //         socket.on("user:friend_joined", (id) => {
        //             let call = peer.call(id, mediaStream);
        //             console.log("friend call: ", call);
        //             call.on("stream", (stream) => {
        //                 setVideos((prev) => {
        //                     prev.push({ srcObject: stream });
        //                     return [...prev];
        //                 });
        //             });
        //         });
        //     });
        // })();

        (async () => {
            let mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setVideos((prev) => {
                prev["my_connection"] = {
                    srcObject: mediaStream,
                    muted: true,
                };
                return { ...prev };
            });
            peer.on("call", (call) => {
                console.log(call);
                call.answer(mediaStream);
                call.on("stream", (stream) => {
                    setVideos((prev) => {
                        prev[call.connectionId] = {
                            srcObject: stream,
                        };
                        return { ...prev };
                    });
                });
            });
            // let otherId = prompt("another id: ");
            // let otherId = "";
            // if (otherId) {
            //     let call = peer.call(otherId, mediaStream);
            //     call.on("stream", (stream) => {
            //         setVideos((prev) => {
            //             prev.push({ srcObject: stream });
            //             return [...prev];
            //         });
            //     });
            // }
            socket.on("user:friend_joined", (userId) => {
                console.log("userId", userId);
                let call = peer.call(userId, mediaStream);
                call.on("stream", (stream) => {
                    setVideos((prev) => {
                        prev[id] = {
                            srcObject: stream,
                        };
                        return { ...prev };
                    });
                });
            });
            peer.on("open", function (id) {
                console.log(peer, id);
                setSocketDoneOnce(true);
            });
        })();
    }, [peer, socket]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box className="w-full">
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
                    {Object.values(Videos).map(({ srcObject, ...rest }, i) => (
                        <VideoElement srcObject={srcObject} {...rest} key={i} />
                    ))}
                </div>
            </Box>
        </Box>
    );
}
