"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { VscAccount } from "react-icons/vsc";
import { BsCardList, BsSun, BsThreeDotsVertical } from "react-icons/bs";
import MobileNotificationItem from "./MobileNotificationItem";
import DesktopNotificationItem from "./DesktopNotificationItem";
import { useColorMode } from "@/contexts/ColorModeContext";
import HoverWrapper from "./chats/HoverWrapper";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import {
    Avatar,
    Divider,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import { redirect } from "next/navigation";
import { PiChatsTeardropDuotone } from "react-icons/pi";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { IoIosLogOut } from "react-icons/io";
import Link from "next/link";
import { SITEMAP } from "@/lib/variables";

export default function AppBarCustom() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = "primary-search-account-menu";

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            id={mobileMenuId}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MobileNotificationItem badgeContent={17} />
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                >
                    <VscAccount />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                >
                    <BsCardList />
                </IconButton>
                <p>More</p>
            </MenuItem>
        </Menu>
    );
    const { mode, setMode } = useColorMode();

    return (
        <HoverWrapper className="rounded-none w-full" classNameInner="bg-none">
            <Box sx={{ flexGrow: 1, width: "100%" }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: "block", fontSize: "1.5rem" }}
                        >
                            💖
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box
                            sx={{ display: { xs: "none", md: "flex" } }}
                            className="items-center"
                        >
                            <IconButton
                                size="large"
                                onClick={() => {
                                    if (mode === "dark") {
                                        document.documentElement.classList.remove(
                                            "dark"
                                        );
                                        localStorage.theme = "light";
                                        setMode!("light");
                                        return;
                                    }
                                    document.documentElement.classList.add(
                                        "dark"
                                    );
                                    localStorage.theme = "dark";
                                    setMode!("dark");
                                }}
                            >
                                <BsSun />
                            </IconButton>
                            <DesktopNotificationItem />
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                            >
                                <Avatar
                                    src={auth?.currentUser?.photoURL || ""}
                                    alt={
                                        auth?.currentUser?.displayName || "You"
                                    }
                                    sx={{
                                        width: 28,
                                        height: 28,
                                    }}
                                />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: { xs: "flex", md: "none" } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                            >
                                <BsThreeDotsVertical />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {renderMobileMenu}
                <RenderMenu
                    handleMenuClose={handleMenuClose}
                    anchorEl={anchorEl}
                    isMenuOpen={isMenuOpen}
                />
            </Box>
        </HoverWrapper>
    );
}

function RenderMenu({
    handleMenuClose,
    anchorEl,
    isMenuOpen,
}: {
    anchorEl: HTMLElement | null;
    isMenuOpen: boolean;
    handleMenuClose: () => void;
}) {
    return (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem component={"h2"} className="uppercase">
                <ListItemText>
                    <Tooltip
                        title={auth.currentUser?.displayName || ""}
                        placement="top"
                        arrow
                    >
                        <Typography noWrap maxWidth="18rem">
                            {auth.currentUser?.displayName || ""}
                        </Typography>
                    </Tooltip>
                </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={handleMenuClose}
                component={Link}
                href={SITEMAP.profile}
            >
                <ListItemIcon>
                    <VscAccount />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={handleMenuClose}
                component={Link}
                href={SITEMAP.chats}
            >
                <ListItemIcon>
                    <PiChatsTeardropDuotone />
                </ListItemIcon>
                <ListItemText>Chat</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={handleMenuClose}
                component={Link}
                href={SITEMAP.all_messages}
            >
                <ListItemIcon>
                    <PiChatsTeardropDuotone />
                </ListItemIcon>
                <ListItemText>All Messages</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={handleMenuClose}
                component={Link}
                href={SITEMAP.general_settings}
            >
                <ListItemIcon>
                    <HiOutlineCog6Tooth />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={async () => {
                    try {
                        await signOut(auth);
                        redirect(SITEMAP.login);
                    } catch (e) {
                        console.warn(e);
                    }
                    handleMenuClose();
                }}
            >
                <ListItemIcon>
                    <IoIosLogOut />
                </ListItemIcon>
                <ListItemText>Log out</ListItemText>
            </MenuItem>
        </Menu>
    );
}
