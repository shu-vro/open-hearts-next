import MessageSent from "./Message";
import MessageForm from "./MessageForm";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import MessageContext from "@/contexts/MessageContext";
import { MessageType } from "@/app";
import AppBarChat from "./AppBarChat";

export default function Chats() {
    const msgForNow: MessageType = {
        emoji: "1f601",
        imageLink: [
            "https://images.unsplash.com/photo-1668162692136-9c490f102de2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
            "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            "https://images.unsplash.com/photo-1682685797857-97de838c192e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            "https://plus.unsplash.com/premium_photo-1666648220960-da4b99a3a17f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
            "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
            "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            "https://plus.unsplash.com/premium_photo-1693155671457-e97a909b5fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
        ],
        text: "Lorem ipsum dolor sit",
        voice: "",
        deleted: false,
        hash: null,
        reply: {
            message: {
                emoji: "1f601",
                imageLink: [
                    "https://images.unsplash.com/photo-1668162692136-9c490f102de2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
                    "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
                    "https://images.unsplash.com/photo-1682685797857-97de838c192e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
                    "https://plus.unsplash.com/premium_photo-1666648220960-da4b99a3a17f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
                    "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
                    "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
                    "https://plus.unsplash.com/premium_photo-1693155671457-e97a909b5fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    "https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
                ],
                text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus eius dolores adipisci dolorum libero corrupti veritatis doloremque ea eaque, quis exercitationem dolorem cum nostrum error laudantium qui saepe rem unde?",
                voice: "",
                reply: null,
                deleted: false,
                hash: null,
            },
            to: "shuvro",
            type: "image",
        },
    };
    return (
        <div className="w-full grow flex flex-row h-[calc(100%-4rem)]">
            <MessageContext>
                <>
                    <LeftSideBar />
                    <main className="grow w-1/2 flex justify-start items-start flex-col h-full">
                        <AppBarChat />
                        <div className="chat-section w-full overflow-y-auto h-full">
                            <MessageSent
                                by="him"
                                type="text"
                                avatarURL="https://mui.com/static/images/avatar/3.jpg"
                                time={1693755271197}
                                metadata={null}
                                msg={msgForNow}
                            />
                            <MessageSent
                                by="me"
                                type="text"
                                avatarURL="https://mui.com/static/images/avatar/3.jpg"
                                time={1693755271197}
                                metadata={null}
                                msg={msgForNow}
                            />
                            <MessageSent
                                by="him"
                                type="emoji"
                                avatarURL="https://mui.com/static/images/avatar/3.jpg"
                                time={1693755271197}
                                metadata={null}
                                msg={msgForNow}
                            />
                            <MessageSent
                                by="me"
                                type="emoji"
                                avatarURL="https://mui.com/static/images/avatar/3.jpg"
                                time={1693755271197}
                                metadata={null}
                                msg={msgForNow}
                            />
                            <MessageSent
                                by="him"
                                type="image"
                                avatarURL="https://mui.com/static/images/avatar/3.jpg"
                                time={1693755271197}
                                metadata={null}
                                msg={msgForNow}
                            />
                            <MessageSent
                                by="me"
                                type="image"
                                avatarURL="https://mui.com/static/images/avatar/3.jpg"
                                time={1693755271197}
                                metadata={null}
                                msg={msgForNow}
                            />
                            <MessageSent
                                by="him"
                                type="voice"
                                avatarURL="https://mui.com/static/images/avatar/3.jpg"
                                time={1693755271197}
                                metadata={null}
                                msg={msgForNow}
                            />
                            <MessageSent
                                by="me"
                                type="voice"
                                avatarURL="https://mui.com/static/images/avatar/3.jpg"
                                time={1693755271197}
                                metadata={null}
                                msg={msgForNow}
                            />
                        </div>
                        <MessageForm />
                    </main>
                    <RightSideBar />
                </>
            </MessageContext>
        </div>
    );
}
