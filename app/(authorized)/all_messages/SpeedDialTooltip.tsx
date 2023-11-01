"use client";
import { Box, SpeedDial } from "@mui/material";
import React, { useState } from "react";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { IoIosCreate } from "react-icons/io";
import { BsSearch } from "react-icons/bs";
import { AlertDialog } from "./AlertDialog";

export default function SpeedDialTooltip({
    setSearching,
}: {
    setSearching: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);

    return (
        <Box>
            <SpeedDial
                ariaLabel="LeftSideBar SpeedDial"
                className="absolute bottom-4 left-4"
                sx={{
                    "& > button": {
                        bgcolor: "secondary.main",

                        "&:hover": {
                            bgcolor: "secondary.dark",
                        },
                    },
                }}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
            >
                <SpeedDialAction
                    icon={<IoIosCreate />}
                    tooltipTitle="Create Group"
                    tooltipOpen
                    tooltipPlacement="right"
                    onClick={() => {
                        setOpenCreateGroupDialog(true);
                    }}
                    sx={{
                        "& > span": {
                            bgcolor: "primary.main",
                        },
                        "& button": {
                            bgcolor: "primary.main",

                            "&:hover": {
                                bgcolor: "primary.dark",
                            },
                        },
                    }}
                />
                <SpeedDialAction
                    icon={<BsSearch />}
                    tooltipTitle="Search"
                    tooltipOpen
                    tooltipPlacement="right"
                    onClick={() => {
                        setSearching((prev) => !prev);
                    }}
                    sx={{
                        "& > span": {
                            bgcolor: "primary.main",
                        },
                        "& button": {
                            bgcolor: "primary.main",

                            "&:hover": {
                                bgcolor: "primary.dark",
                            },
                        },
                    }}
                />
            </SpeedDial>
            <AlertDialog
                open={openCreateGroupDialog}
                setOpen={setOpenCreateGroupDialog}
            />
        </Box>
    );
}
