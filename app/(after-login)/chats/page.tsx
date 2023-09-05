"use client";

import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { AppBar, Avatar, IconButton } from "@mui/material";
import { BsCameraVideo, BsTelephone } from "react-icons/bs";
import { MessageSent } from "./Message";
import { useTheme } from "@mui/material";
import { useState } from "react";
import { Message } from "@/app";
import MessageForm from "./MessageForm";

export default function Chats() {
    const theme = useTheme();
    const [message, setMessage] = useState<Message>({
        text: "",
        imageLink: [],
        emoji: "",
    });
    return (
        <div className="w-full grow flex flex-row h-[calc(100%-4rem)]">
            <LeftSideBar />
            <main className="grow w-1/2 flex justify-start items-start flex-col h-full">
                <AppBar
                    position="static"
                    className="flex justify-center items-center flex-row p-2 gap-4"
                    sx={{
                        bgcolor: theme.palette.mySwatch.messageBG,
                    }}
                >
                    <Avatar
                        src="https://mui.com/static/images/avatar/3.jpg"
                        alt="avatar"
                        sx={{ width: 56, height: 56 }}
                    />
                    <span className="grow text-2xl capitalize font-semibold">
                        My name
                    </span>
                    <IconButton>
                        <BsTelephone />
                    </IconButton>
                    <IconButton>
                        <BsCameraVideo />
                    </IconButton>
                </AppBar>
                <div className="chat-section w-full overflow-y-auto h-full">
                    <MessageSent by="him" type="text" />
                    <MessageSent by="me" type="image" />
                    <MessageSent by="me" type="text" />
                    <MessageSent by="him" type="image" />
                    <MessageSent by="me" type="emoji" />
                    <MessageSent by="him" type="emoji" />
                </div>
                <MessageForm message={message} setMessage={setMessage} />
            </main>
            <RightSideBar />
        </div>
    );
}
