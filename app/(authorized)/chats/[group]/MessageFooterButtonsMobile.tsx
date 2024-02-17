import { MessageType } from "@/app";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { auth, firestoreDb } from "@/firebase";
import { cn } from "@/lib/utils";
import { DATABASE_PATH } from "@/lib/variables";
import {
    Box,
    Button,
    ButtonGroup,
    IconButton,
    SwipeableDrawer,
} from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";

export default function MessageFooterButtonsMobile({
    by,
    setMessage,
    msg,
    groupId,
}: {
    by: "me" | "him";
    setMessage: React.Dispatch<React.SetStateAction<MessageType>>;
    msg: MessageType;
    groupId?: string;
}) {
    const [open, setOpen] = useState(process.env.NODE_ENV == "development");
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(false);
    };
    const { setMessage: setToastMessage } = useToastAlert();
    return (
        <div
            className={cn(
                "reply flex justify-center items-center flex-row-reverse",
                by === "him"
                    ? "justify-self-end"
                    : "justify-self-start flex-row"
            )}
            style={{ gridArea: "reply" }}
        >
            <IconButton
                onClick={() => {
                    setOpen(true);
                }}
                size="small"
                color="primary"
                sx={{
                    border: "1px solid currentcolor",
                }}
            >
                <BsThreeDots />
            </IconButton>
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                disableSwipeToOpen={true}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    "&.MuiDrawer-root > .MuiPaper-root": {
                        height: `165px`,
                        overflow: "visible",
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        background: `rgba(255, 255, 255, 0.2)`,
                        backdropFilter: `blur(10px)`,
                    },
                }}
            >
                <Box
                    sx={{
                        width: `100%`,
                        height: `25px`,
                        position: "sticky",
                        top: "0",
                        display: `grid`,
                        placeItems: "center",
                    }}
                >
                    <div
                        style={{
                            width: 75,
                            height: 5,
                            background: `rgba(255, 255, 255, .5)`,
                            borderRadius: "100px",
                        }}
                    ></div>
                </Box>
                <Box
                    sx={{
                        pb: 2,
                        height: "100%",
                        overflow: "auto",
                        px: 3,
                    }}
                >
                    <ButtonGroup
                        orientation="vertical"
                        fullWidth
                        variant="text"
                        size="large"
                    >
                        <Button
                            onClick={() => {
                                setMessage((prev) => {
                                    return {
                                        ...prev,
                                        reply: msg.id,
                                    };
                                });
                                setOpen(false);
                            }}
                        >
                            reply
                        </Button>
                        <Button
                            onClick={async () => {
                                if (!groupId)
                                    return setToastMessage(
                                        "Group is not resolved"
                                    );
                                if (!auth.currentUser)
                                    return setToastMessage(
                                        "User is not resolved"
                                    );
                                try {
                                    await setDoc(
                                        doc(
                                            firestoreDb,
                                            DATABASE_PATH.groupDetails,
                                            groupId as string,
                                            DATABASE_PATH.messages,
                                            msg.id
                                        ),
                                        {
                                            pinned: !msg.pinned,
                                        } as Partial<MessageType>,
                                        {
                                            merge: true,
                                        }
                                    );
                                } catch (e) {
                                    setToastMessage(
                                        "Error: pinned message went wrong!"
                                    );
                                }
                                setOpen(false);
                            }}
                        >
                            {msg.pinned ? "unpin" : "pin"} message
                        </Button>
                        <Button>delete</Button>
                    </ButtonGroup>
                </Box>
            </SwipeableDrawer>
        </div>
    );
}
