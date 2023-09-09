import { AppBar, Avatar, IconButton } from "@mui/material";
import { BsCameraVideo, BsTelephone } from "react-icons/bs";
import MessageSent from "./Message";
import { useTheme } from "@mui/material";
import MessageForm from "./MessageForm";
import Link from "next/link";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import MessageContext from "@/contexts/MessageContext";

export default function Chats() {
    const theme = useTheme();
    return (
        <div className="w-full grow flex flex-row h-[calc(100%-4rem)]">
            <MessageContext>
                <>
                    <LeftSideBar />
                    <main className="grow w-1/2 flex justify-start items-start flex-col h-full">
                        <AppBar
                            position="static"
                            className="flex justify-center items-center flex-row p-2 gap-4 text-current"
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
                            <IconButton
                                LinkComponent={Link}
                                href="/chats/call?mode=audio"
                            >
                                <BsTelephone />
                            </IconButton>
                            <IconButton
                                LinkComponent={Link}
                                href="/chats/call?mode=video"
                            >
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
                            <MessageSent by="him" type="voice" />
                            <MessageSent by="me" type="voice" />
                        </div>
                        <MessageForm />
                    </main>
                    <RightSideBar />
                </>
            </MessageContext>
        </div>
    );
}
