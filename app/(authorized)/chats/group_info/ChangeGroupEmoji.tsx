"use client";

import EmojiPicker, {
    EmojiStyle,
    Theme,
    EmojiClickData,
} from "emoji-picker-react";
import React from "react";
import { changeGroupInformation } from "@/lib/helpers/firebase-helpers";
import { useParams } from "next/navigation";
import { useTheme } from "@mui/material";

export default function ChangeGroupEmoji() {
    const { group } = useParams() as { group: string };
    const {
        palette: { mode: themeMode },
    } = useTheme();
    return (
        <EmojiPicker
            onEmojiClick={(emojiData: EmojiClickData, event: MouseEvent) => {
                console.log(emojiData.unified, group);
                if (!group) {
                    //
                } else {
                    changeGroupInformation(group, {
                        emoji: emojiData.unified,
                    });
                }
            }}
            autoFocusSearch={false}
            theme={themeMode as Theme}
            searchPlaceHolder="Filter "
            emojiStyle={EmojiStyle.FACEBOOK}
            width={"100%"}
        />
    );
}
