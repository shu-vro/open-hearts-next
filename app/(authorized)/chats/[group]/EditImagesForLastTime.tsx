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
import { deleteObject, listAll, ref } from "firebase/storage";
import { storage } from "@/firebase";
import { useGroup } from "@/contexts/GroupContext";
import { useToastAlert } from "@/contexts/ToastAlertContext";

/**
 * @required - for [MessageForm.tsx](./MessageForm.tsx)
 *
 * This will conditionally show preview of images and replies
 */

function DisplayLocalConfirmationDialog({
    // setMessage,
    openDialog,
    handleConfirmDialogClose,
    handleDeleteFromStorage,
}: {
    // setMessage: React.Dispatch<React.SetStateAction<MessageType>>;
    openDialog: boolean;
    handleConfirmDialogClose: () => void;
    handleDeleteFromStorage: () => Promise<void>;
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
                        control={
                            <Checkbox
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        localStorage.DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN =
                                            "true";
                                    }
                                }}
                            />
                        }
                        label="I understand. Do not show me this dialog."
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirmDialogClose} variant="contained">
                    Cancel
                </Button>
                <Button
                    onClick={async () => {
                        // setMessage((prev) => {
                        //     let n = { ...prev };
                        //     n.imageLink = [];
                        //     return n;
                        // });
                        await handleDeleteFromStorage();
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
    const { group } = useGroup();
    const { setMessage: setToastMessage } = useToastAlert();

    const handleConfirmDialogClose = () => {
        setOpenDialog(false);
    };
    const handleDeleteFromStorage = async () => {
        if (!group) return;
        const listRef = ref(storage, `${group.id}/${message.id}`);

        try {
            const listAllRef = await listAll(listRef);
            listAllRef.items.forEach((itemRef) => {
                deleteObject(itemRef)
                    .then(() => {
                        setMessage((prev) => {
                            let n = { ...prev };
                            n.imageLink = [];
                            return n;
                        });
                    })
                    .catch((e) => {
                        setToastMessage(`Error: ${e}`);
                        console.warn(e);
                    });
            });
        } catch (e) {
            setToastMessage(`Error: ${e}`);
            console.warn(e);
        }
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
                onClick={async () => {
                    if (
                        localStorage.DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN !==
                        "true"
                    ) {
                        setOpenDialog(true);
                    } else {
                        await handleDeleteFromStorage();
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
                // setMessage={setMessage}
                openDialog={openDialog}
                handleConfirmDialogClose={handleConfirmDialogClose}
                handleDeleteFromStorage={handleDeleteFromStorage}
            ></DisplayLocalConfirmationDialog>
        </Box>
    ) : null;
}
