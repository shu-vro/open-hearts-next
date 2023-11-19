import { IconButton, Paper } from "@mui/material";
import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { MdKeyboardVoice } from "react-icons/md";
import GetEmojiLink from "./GetEmojiLink";
import { defaultMessage, useMessage } from "@/contexts/MessageContext";
import { VscClose } from "react-icons/vsc";
import { BiImages } from "react-icons/bi";
import HoverWrapper from "../../HoverWrapper";
import ReplySection from "./ReplySection";

type Props = { open: boolean };

export default function MessageFormStack({ open }: Props) {
    return open ? (
        <Paper
            className="absolute bottom-full left-0 w-full py-3 rounded-[.75rem_.75rem_0_0] z-10 flex flex-col"
            elevation={4}
        >
            <Box
                className="grid"
                sx={{
                    gridTemplateAreas: `'cross'
                                         'images'
                    `,
                }}
            >
                <VscClose
                    style={{
                        gridArea: "cross",
                    }}
                    className="justify-self-end cursor-pointer text-2xl"
                />
                <Box
                    className="flex flex-row overflow-x-auto overflow-y-hidden relative"
                    sx={{
                        gridArea: "images",
                    }}
                >
                    {Array(15)
                        .fill("")
                        .map((_, i) => (
                            <HoverWrapper
                                className="ml-2 first:ml-4 relative"
                                key={i}
                            >
                                <div className="image-tile w-24 h-24 rounded-[inherit]">
                                    <img
                                        className="object-cover w-full h-full rounded-[inherit]"
                                        src="https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                        alt="tile"
                                    />
                                </div>
                                <IconButton
                                    className="absolute right-0 top-0"
                                    size="small"
                                >
                                    <VscClose />
                                </IconButton>
                            </HoverWrapper>
                        ))}
                </Box>
            </Box>
            <ReplySection />
        </Paper>
    ) : null;
}
