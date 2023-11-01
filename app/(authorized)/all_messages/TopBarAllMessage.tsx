"use client";

import {
    AppBar,
    Box,
    Button,
    ButtonGroup,
    SpeedDial,
    Toolbar,
} from "@mui/material";
import React, { useState } from "react";
import { AlertDialog } from "./AlertDialog";

export default function TopBarAllMessage({
    setSearching,
}: {
    setSearching: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);

    return (
        <Box position="sticky" className="top-0 bg-none">
            <Toolbar className="grid place-items-center">
                <ButtonGroup
                    variant="outlined"
                    aria-label="outlined primary button group"
                    fullWidth
                >
                    <Button
                        onClick={() => {
                            setOpenCreateGroupDialog(true);
                        }}
                    >
                        Create Group
                    </Button>
                    <Button
                        onClick={() => {
                            setSearching((prev) => !prev);
                        }}
                    >
                        Search
                    </Button>
                </ButtonGroup>
                <AlertDialog
                    open={openCreateGroupDialog}
                    setOpen={setOpenCreateGroupDialog}
                />
            </Toolbar>
        </Box>
    );
}
