"use client";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { Box } from "@mui/material";
import { useMessage } from "@/contexts/MessageContext";
import { VscClose } from "react-icons/vsc";
import HoverWrapper from "../../HoverWrapper";
import { MessageType } from "@/app";

/**
 * @required - for [MessageForm.tsx](./MessageForm.tsx)
 *
 * This will conditionally show preview of images and replies
 */

function DisplayLocalConfirmationDialog({
    setMessage,
    openDialog,
    handleConfirmDialogClose,
}: {
    setMessage: React.Dispatch<React.SetStateAction<MessageType>>;
    openDialog: boolean;
    handleConfirmDialogClose: () => void;
}) {
    return (
        <Dialog open={openDialog} onClose={handleConfirmDialogClose}>
            <DialogTitle id="alert-dialog-title">WARNING</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    If you close this tab, your images won&apos;t be send. You
                    can remove and get preview of images from this section.{" "}
                    <br />
                    Confirm to delete all images?
                    <br />
                    <br />
                    <FormControlLabel
                        control={<Checkbox />}
                        label="I understand. Do not show me this dialog."
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirmDialogClose} variant="contained">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        setMessage((prev) => {
                            let n = { ...prev };
                            n.imageLink = [];
                            return n;
                        });
                        handleConfirmDialogClose();
                    }}
                    autoFocus
                    color="error"
                    variant="contained"
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export function EditImagesForLastTime() {
    const { message, setMessage } = useMessage();
    const [openDialog, setOpenDialog] = useState(false);

    const handleConfirmDialogClose = () => {
        setOpenDialog(false);
    };
    return message.imageLink.length ? (
        <Box
            className="grid"
            sx={{
                gridTemplateAreas: `'cross'
                                   'images'`,
            }}
        >
            <VscClose
                style={{
                    gridArea: "cross",
                }}
                className="justify-self-end cursor-pointer text-2xl"
                onClick={() => {
                    if (
                        localStorage.DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN !==
                        null
                    ) {
                        setOpenDialog(true);
                    } else {
                        // ask for confirmation
                    }
                }}
            />
            <Box
                className="flex flex-row overflow-x-auto overflow-y-hidden relative"
                sx={{
                    gridArea: "images",
                }}
            >
                {message.imageLink.map((link) => (
                    <HoverWrapper
                        className="ml-2 first:ml-4 relative"
                        key={link}
                    >
                        <Box
                            className="image-tile w-24 h-24 rounded-[inherit] block"
                            component={"a"}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                className="object-cover w-full h-full rounded-[inherit]"
                                // src="https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                src={link}
                                alt="tile"
                            />
                        </Box>
                        <IconButton
                            className="absolute right-0 top-0"
                            size="small"
                            onClick={() => {
                                setMessage((prev) => {
                                    let n = { ...prev };
                                    n.imageLink = n.imageLink.filter(
                                        (l) => l !== link
                                    );
                                    return n;
                                });
                            }}
                        >
                            <VscClose />
                        </IconButton>
                    </HoverWrapper>
                ))}
            </Box>
            <DisplayLocalConfirmationDialog
                setMessage={setMessage}
                openDialog={openDialog}
                handleConfirmDialogClose={handleConfirmDialogClose}
            ></DisplayLocalConfirmationDialog>
        </Box>
    ) : null;
}
