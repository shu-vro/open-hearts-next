import { useGroup } from "@/contexts/GroupContext";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { auth, storage } from "@/firebase";
import { changeGroupInformation } from "@/lib/helpers/firebase-helpers";
import { cn } from "@/lib/utils";
import { ROLE } from "@/lib/variables";
import { LoadingButton } from "@mui/lab";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { IoPencil } from "react-icons/io5";

export default function EditAndDisplayAvatar() {
    const { group } = useGroup();
    const [file, setFile] = useState<string | null | undefined>(
        group?.photoURL
    );
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const { setMessage } = useToastAlert();
    const matches_962 = useMediaQuery("(max-width: 962px)");

    const handleFileChange = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setFile(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            <Box className="group/avatar mx-auto my-6 relative w-fit">
                <Avatar
                    src={group?.photoURL || ""}
                    alt="Some Avatar"
                    sx={{
                        width: matches_962 ? `360px` : `160px`,
                        height: matches_962 ? `360px` : `160px`,
                    }}
                />
                {(group?.groupMembersBasicDetails.find(
                    (e) => e.id === auth.currentUser?.uid
                )?.role ?? ROLE.member) < ROLE.member && (
                    <IconButton
                        size="small"
                        className={cn(
                            "bottom-0 right-0 invisible group-hover/avatar:visible"
                        )}
                        sx={{
                            position: "absolute",
                        }}
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        <IoPencil />
                    </IconButton>
                )}
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Change Group Photo
                </DialogTitle>
                <DialogContent>
                    <FileUploader
                        multiple={false}
                        handleChange={handleFileChange}
                        name="file"
                        types={["jpeg", "jpg", "png"]}
                        classes={cn(
                            "cursor-pointer flex justify-start items-center flex-row w-[460px] h-[460px] max-w-full",
                            "grid place-items-center relative"
                        )}
                    >
                        <Avatar
                            src={file || group?.photoURL || ""}
                            alt={group?.name || "Group Name"}
                            className="object-contain absolute top-1/2 left-1/2"
                            sx={{
                                width: `100%`,
                                height: `100%`,
                                transform: `translate(-50%, -50%)`,
                                borderRadius: 0,
                            }}
                        />
                        <h1 className="mix-blend-soft-light text-center text-[2.5rem] font-extrabold color-black absolute">
                            Click <br />
                            or <br />
                            Drag and drop
                        </h1>
                    </FileUploader>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained">
                        Cancel
                    </Button>
                    <LoadingButton
                        loading={loading}
                        onClick={() => {
                            setLoading(true);
                            if (!group) {
                                return;
                            }
                            if (!file || file === group.photoURL) return;
                            // downscale image
                            const canvas = document.createElement("canvas")!;
                            const image = new Image();
                            image.src = file;
                            const RATIO =
                                image.naturalHeight / image.naturalWidth;
                            const SIZE =
                                image.naturalWidth > 300
                                    ? 300
                                    : image.naturalWidth;
                            canvas.width = SIZE;
                            canvas.height = SIZE * RATIO;
                            const ctx = canvas.getContext("2d")!;

                            image.onload = async () => {
                                try {
                                    ctx.drawImage(
                                        image,
                                        0,
                                        0,
                                        canvas.width,
                                        canvas.height
                                    );

                                    const storageRef = ref(
                                        storage,
                                        group.id + "/profile"
                                    );
                                    const result = await uploadString(
                                        storageRef,
                                        canvas.toDataURL(),
                                        "data_url"
                                    );
                                    let photoURL = await getDownloadURL(
                                        result.ref
                                    );
                                    setFile(photoURL);
                                    changeGroupInformation(group.id, {
                                        photoURL,
                                    });
                                } catch (e) {
                                    setMessage("error uploading image");
                                    console.log(
                                        `%c${JSON.stringify(e, null, 2)}`,
                                        "color: white;background: dodgerblue;border-radius: 5px;padding: 7px;font-size: 1em;"
                                    );
                                }
                                canvas.remove();
                                image.remove();
                                setLoading(false);
                                handleClose();
                            };
                        }}
                        autoFocus
                        color="success"
                        variant="contained"
                    >
                        <span>Save</span>
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
