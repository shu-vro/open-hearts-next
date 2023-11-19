"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Box } from "@mui/material";
import { MessageType } from "@/app";
import ReplyBox from "./ReplyBox";
import { Props, NativeHoverWrapper } from "./Message";

export default function DeletedMessageBox({
    by,
    reply,
}: {
    by: Props["by"];
    reply: MessageType["reply"];
}) {
    return (
        <div
            className={cn(
                "flex justify-start flex-col",
                by === "me" ? "items-end" : "items-start"
            )}
            style={{
                gridArea: "message",
            }}
        >
            <ReplyBox
                by={by} // stupidity for now.
                replyId={reply}
            />
            <NativeHoverWrapper
                replied={!!reply}
                className={cn(by === "me" && "float-right")}
            >
                <Box
                    className={cn(
                        "text-sm p-3 rounded-lg bg-[#fdeded] dark:bg-[#210b0b] text-[#5f2120] dark:text-[#f4c7c7]",
                        by === "me" ? "text-right ml-auto" : ""
                    )}
                    sx={{
                        background: (theme) =>
                            by === "him"
                                ? theme.palette.mySwatch.messageBG
                                : theme.palette.primary.main,
                    }}
                >
                    This message was deleted by sender
                </Box>
            </NativeHoverWrapper>
        </div>
    );
}
