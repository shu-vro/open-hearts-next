"use client";

import TextField from "@mui/material/TextField";
import GifButton from "./GifButton";
import { useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import { MdSend } from "react-icons/md";
import AddMoreButton from "./AddMoreButton";
import GetEmojiLink from "./GetEmojiLink";
import { defaultMessage, useMessage } from "@/contexts/MessageContext";
import { useGroup } from "@/contexts/GroupContext";
import { setChatMessage } from "@/lib/helpers/firebase-helpers";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { auth } from "@/firebase";
import MessageFormStack from "./MessageFormStack";
import { nanoid } from "nanoid";

export default function MessageForm() {
    const { group } = useGroup();
    const { setMessage: setToastMessage } = useToastAlert();
    const { message, setMessage } = useMessage();
    const form = useRef<HTMLFormElement>(null);

    useEffect(() => {
        console.log(message);
    }, [message]);

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                if (!group)
                    return setToastMessage(
                        "error: Group is not set. Refresh the browser or navigate using group tile"
                    );
                else if (!auth.currentUser)
                    return setToastMessage("error: Authorization error");
                console.log(message);

                message.sender_id = auth.currentUser?.uid;
                let BasicDetails = group.groupMembersBasicDetails?.find(
                    (member) => member.id === auth.currentUser?.uid
                );
                try {
                    setChatMessage(group.id, message, BasicDetails, message.id);
                } catch (e: any) {
                    setToastMessage(e.message);
                }
                setMessage(() => ({ ...defaultMessage, id: nanoid() }));
            }}
            ref={form}
            className="input-area flex justify-end items-center w-full relative"
            action="get"
        >
            <MessageFormStack
                open={Boolean(message.reply || message.imageLink.length)}
            />
            <AddMoreButton form={form.current!} />
            <TextField
                label="Type something..."
                variant="outlined"
                multiline
                maxRows={4}
                fullWidth
                className="grow z-50"
                name="message"
                value={message.text}
                onChange={(e) => {
                    setMessage((prev) => ({
                        ...prev,
                        text: e.target.value,
                    }));
                }}
                onKeyUp={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        // Submit the form when Enter is pressed without Shift
                        form.current?.dispatchEvent(
                            new Event("submit", {
                                bubbles: true,
                            })
                        );
                        setMessage((prev) => ({ ...prev, text: "" }));
                    }
                }}
            />
            <GifButton form={form.current!} />
            {message.text === "" &&
            message.voice === "" &&
            message.imageLink.length === 0 ? (
                <IconButton
                    size="large"
                    type="button"
                    onClick={() => {
                        setMessage((prev) => {
                            return {
                                ...defaultMessage,
                                id: prev.id,
                                emoji: group?.emoji || "1f44d",
                            };
                        });
                        setTimeout(() => {
                            form.current?.dispatchEvent(
                                new Event("submit", {
                                    bubbles: true,
                                })
                            );
                        }, 100);
                    }}
                >
                    <GetEmojiLink unified={group?.emoji || "1f44d"} size={28} />
                </IconButton>
            ) : (
                <IconButton size="large" type="submit">
                    <MdSend />
                </IconButton>
            )}
        </form>
    );
}
