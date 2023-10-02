import { Badge, IconButton, Popover, Typography } from "@mui/material";
import { useState } from "react";
import Notification from "./chats/notifications/Notification";
import { BsBell } from "react-icons/bs";

export default function DesktopNotificationItem() {
    const [anchorElForMessagesPopover, setAnchorElForMessagesPopover] =
        useState<null | HTMLElement>(null);
    return (
        <>
            <Popover
                id="messages-popover"
                open={Boolean(anchorElForMessagesPopover)}
                anchorEl={anchorElForMessagesPopover}
                onClose={() => setAnchorElForMessagesPopover(null)}
                sx={{
                    "& > .MuiPopover-paper": {
                        maxHeight: 400,
                        width: 600,
                        borderRadius: 3,
                    },
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <div className="w-full h-full flex flex-col justify-start items-start gap-4 max-[668px]:gap-2">
                    {Array(15)
                        .fill("")
                        .map((e: unknown, i: number) => (
                            <Notification
                                name="my name"
                                photoURL="https://mui.com/static/images/avatar/3.jpg"
                                time={new Date().toISOString()}
                                description={
                                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero impedit unde saepe eos, mollitia tenetur delectus reprehenderit, vitae deleniti molestiae quo harum? Dolore quibusdam saepe fugit odit odio maxime itaque!"
                                }
                                url="#"
                                key={i}
                                iconOnly={true}
                            />
                        ))}
                </div>
            </Popover>
            <IconButton
                size="large"
                aria-label="show 17 new notifications"
                onClick={(e) => setAnchorElForMessagesPopover(e.currentTarget)}
            >
                <Badge badgeContent={17} color="error">
                    <BsBell />
                </Badge>
            </IconButton>
        </>
    );
}
