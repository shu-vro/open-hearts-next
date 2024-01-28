import { Badge, IconButton, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { BsBell } from "react-icons/bs";
import ParseNotifications from "./notifications/ParseNotifications";
import useNotifications from "@/lib/hooks/useNotifications";
import { auth } from "@/firebase";

export default function DesktopNotificationItem() {
    const notifications = useNotifications();
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
                <div className="w-full h-full flex flex-col justify-start items-start gap-4 max-[668px]:gap-2 py-4">
                    <ParseNotifications
                        iconOnly={true}
                        notifications={notifications}
                    />
                </div>
            </Popover>
            <IconButton
                size="large"
                aria-label="show 17 new notifications"
                onClick={(e) => setAnchorElForMessagesPopover(e.currentTarget)}
            >
                <Badge
                    badgeContent={
                        notifications.filter((notification) => {
                            return (
                                notification.seen.findIndex(
                                    (element) =>
                                        element.id === auth.currentUser?.uid &&
                                        element.done === false
                                ) > -1
                            );
                        }).length
                    }
                    color="error"
                >
                    <BsBell />
                </Badge>
            </IconButton>
        </>
    );
}
