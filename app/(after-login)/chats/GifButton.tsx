"use client";

import { Message } from "@/app";
import { useTheme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import GifPicker, { Theme } from "gif-picker-react";
import { useState } from "react";
import { PiGifFill } from "react-icons/pi";

export default function GifButton({
    setMessage,
    form,
}: {
    setMessage: React.Dispatch<React.SetStateAction<Message>>;
    form: HTMLFormElement;
}) {
    const [anchorElPopover, setAnchorElPopover] = useState<null | HTMLElement>(
        null
    );
    const {
        palette: { mode },
    } = useTheme();
    return (
        <>
            <Popover
                id="gif-popover"
                open={Boolean(anchorElPopover)}
                anchorEl={anchorElPopover}
                onClose={() => setAnchorElPopover(null)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <GifPicker
                    onGifClick={(e) => {
                        setMessage((prev) => {
                            return {
                                ...prev,
                                imageLink: prev.imageLink.concat([e.url]),
                            };
                        });
                        setTimeout(() => {
                            form.dispatchEvent(
                                new Event("submit", {
                                    bubbles: true,
                                })
                            );
                        }, 100);
                    }}
                    theme={mode as Theme}
                    tenorApiKey={process.env.NEXT_PUBLIC_TENOR_API_KEY!}
                />
            </Popover>
            <IconButton
                type="button"
                size="large"
                aria-label="open gif panel"
                onClick={(e) => setAnchorElPopover(e.currentTarget)}
            >
                <PiGifFill />
            </IconButton>
        </>
    );
}
