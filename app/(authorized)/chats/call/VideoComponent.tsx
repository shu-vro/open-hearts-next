"use client";

import { useState, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import VideoCallDrawer from "./VideoCallDrawer";
import { type Peer } from "peerjs";
import { Toolbar } from "@mui/material";
import { useSocket } from "@/contexts/SocketContext";
import { useToastAlert } from "@/contexts/ToastAlertContext";

const drawerWidth = 320;

type VideoElementProps = {
    srcObject: MediaStream | MediaSource;
} & React.HTMLProps<HTMLVideoElement>;

function VideoElement({ srcObject, ...rest }: VideoElementProps) {
    const video = useRef<HTMLVideoElement>(null);
    useEffect(() => {
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
    const { setMessage } = useToastAlert();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [peer, setPeer] = useState<Peer>();
    const [Videos, setVideos] = useState<{
        [x: string]: VideoElementProps;
    }>({});
    const [socketDoneOnce, setSocketDoneOnce] = useState(false);
    const { socket } = useSocket();
    const [mediaStream, setMediaStream] = useState<MediaStream>();

    useEffect(() => {
        if (!socket) return;
        if (!peer && typeof navigator !== "undefined") {
            (async () => {
                const PeerJs = (await import("peerjs")).default;
                socket?.on("connect", () => {
                    setPeer(
                        new PeerJs(socket?.id || "experimental_for_future")
                    );
                });
            })();
        }

        return () => {
            if (peer) {
                peer.disconnect();
            }
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        if (!peer) {
            return;
        }
        if (!mediaStream) return;
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
        socket.on("user:friend_joined", (userId) => {
            console.log("userId", userId);
            let call = peer.call(userId, mediaStream);
            call.on("stream", (stream) => {
                setVideos((prev) => {
                    prev[userId] = {
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
    }, [peer, socket, mediaStream]);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true,
            })
            .then((mediaStream) => {
                setMediaStream(mediaStream);

                setVideos((prev) => {
                    prev["my_connection"] = {
                        srcObject: mediaStream,
                        muted: true,
                    };
                    return { ...prev };
                });
            })
            .catch(setMessage);

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        };
    }, []);

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
