"use client";

import TextField from "@mui/material/TextField";
import GifButton from "./GifButton";
import { useRef } from "react";
import { IconButton, useTheme } from "@mui/material";
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
import sanitize from "@/lib/helpers/rehype-purify";
import MDEditor from "@uiw/react-md-editor";

export default function MessageForm() {
    const {
        palette: { mode: themeMode },
    } = useTheme();
    const { group } = useGroup();
    const { setMessage: setToastMessage } = useToastAlert();
    const { message, setMessage } = useMessage();
    const submit_form_button = useRef<HTMLButtonElement>(null);

    return (
        <form
            onSubmit={async function (e) {
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
                    message.text = await sanitize(message.text);
                    await setChatMessage(
                        group.id,
                        message,
                        BasicDetails,
                        message.id
                    );
                } catch (e: any) {
                    setToastMessage(e.message);
                }
                const chat_section = document.getElementById("chat_section");
                chat_section?.scrollTo({
                    top: chat_section.scrollHeight,
                    left: 0,
                    behavior: "smooth",
                });
                setMessage(() => ({ ...defaultMessage, id: nanoid() }));
            }}
            data-color-mode={themeMode}
            className="input-area flex justify-end items-center w-full relative"
        >
            <MessageFormStack
                open={Boolean(message.reply || message.imageLink.length)}
            />
            <AddMoreButton submit_form_button={submit_form_button.current!} />
            {/* <MDEditor
                value={message.text}
                onChange={(v) => {
                    setMessage((prev) => ({
                        ...prev,
                        text: v as string,
                    }));
                }}
                className="grow z-50"
                visibleDragbar={false}
            /> */}
            <TextField
                label="Type something..."
                variant="outlined"
                multiline
                maxRows={6}
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
                        submit_form_button.current?.click();
                        setMessage((prev) => ({ ...prev, text: "" }));
                    }
                }}
            />
            <button
                className="hidden opacity-0 select-none"
                type="submit"
                ref={submit_form_button}
            >
                submit
            </button>
            <GifButton submit_form_button={submit_form_button.current!} />
            {message.text === "" &&
            message.voice === "" &&
            message.imageLink.length === 0 ? (
                <IconButton
                    size="large"
                    type="submit"
                    onClick={() => {
                        setMessage((prev) => {
                            return {
                                ...defaultMessage,
                                id: prev.id,
                                emoji: group?.emoji || "1f44d",
                            };
                        });
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
