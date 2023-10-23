"use client";

import { Badge, IconButton, MenuItem } from "@mui/material";
import React from "react";
import { MdOutlineNotifications } from "react-icons/md";
import { useRouter } from "next/navigation";
import { SITEMAP } from "@/lib/variables";

export default function MobileNotificationItem({
    badgeContent,
}: {
    badgeContent: number;
}) {
    const { push } = useRouter();
    return (
        <>
            <MenuItem
                onClick={() => {
                    push(SITEMAP.notifications);
                }}
            >
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={badgeContent} color="error">
                        <MdOutlineNotifications />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
        </>
    );
}
