"use client";

import React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { HiBars3, HiOutlineCog6Tooth } from "react-icons/hi2";
import { HiOutlineMail } from "react-icons/hi";
import { PiPasswordDuotone } from "react-icons/pi";
import { RxAccessibility, RxCross1 } from "react-icons/rx";
import { cn } from "@/lib/utils";
import Link from "next/link";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

export default function Layout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(
        window.localStorage.settingsDrawer
            ? window.localStorage.settingsDrawer
            : false
    );

    const handleDrawerToggle = () => {
        setOpen(!open);
        window.localStorage.settingsDrawer = !open;
    };

    return (
        <Box className="w-full grow h-[calc(100%-4rem)] flex">
            <Drawer
                variant="permanent"
                open={open}
                className="top-16"
                sx={{
                    "& > .MuiPaper-root": {
                        top: "4rem",
                    },
                }}
            >
                <List>
                    <ListItem disablePadding sx={{ display: "block" }}>
                        <ListItemButton
                            onClick={handleDrawerToggle}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                className={cn(
                                    "min-w-0 justify-center text-2xl",
                                    open ? "mr-3" : "mr-auto"
                                )}
                            >
                                {open ? <RxCross1 /> : <HiBars3 />}
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    {[
                        {
                            icon: <HiOutlineCog6Tooth />,
                            text: "general",
                        },
                        {
                            icon: <HiOutlineMail />,
                            text: "email",
                        },
                        {
                            icon: <PiPasswordDuotone />,
                            text: "password",
                        },
                        {
                            icon: <RxAccessibility />,
                            text: "accessibility",
                        },
                    ].map((li) => (
                        <ListItem
                            key={li.text}
                            disablePadding
                            className="block capitalize text-2xl"
                        >
                            <ListItemButton
                                LinkComponent={Link}
                                href={`/settings/${li.text}`}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    {li.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={li.text}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
                className="overflow-y-auto"
            >
                {children}
            </Box>
        </Box>
    );
}
