import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { BsFillChatLeftTextFill } from "react-icons/bs";

const drawerWidth = 320;

export default function VideoComponent() {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = <div></div>;

    return (
        <Box className="w-full">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: "block" }}
                    >
                        <BsFillChatLeftTextFill />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Video Call
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    anchor="right"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: "block",
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                className="grow p-3 w-full h-[calc(100%-8rem)]"
            >
                <div className="videos grid grid-cols-2 w-full">
                    <video
                        src="https://www.pexels.com/download/video/1321208/"
                        className="w-full"
                        autoPlay
                        controls
                    ></video>
                    <video
                        src="https://www.pexels.com/download/video/1321208/"
                        className="w-full"
                        autoPlay
                        controls
                    ></video>
                    <video
                        src="https://www.pexels.com/download/video/1321208/"
                        className="w-full"
                        autoPlay
                        controls
                    ></video>
                    <video
                        src="https://www.pexels.com/download/video/1321208/"
                        className="w-full"
                        autoPlay
                        controls
                    ></video>
                </div>
            </Box>
        </Box>
    );
}
