import InputField from "@/app/(auth)/InputField";
import { auth } from "@/firebase";
import { LoadingButton } from "@mui/lab";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import {
    EmailAuthProvider,
    GoogleAuthProvider,
    reauthenticateWithCredential,
    reauthenticateWithPopup,
} from "firebase/auth";
import React, { useState } from "react";

export default function Reauthenticate({
    handleSubmit,
    open,
    setOpen,
}: {
    handleSubmit: () => void;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReauthenticate = async () => {
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user || !user.email) return;

            if (
                auth.currentUser?.providerData.find(
                    (p) => p.providerId === "google.com"
                )
            ) {
                let provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(user, provider);
            } else {
                const credentials = EmailAuthProvider.credential(
                    user.email,
                    password
                );
                await reauthenticateWithCredential(user, credentials);
            }
            setOpen(false);
            await handleSubmit();
        } catch (error) {
            console.log("error: ", error);
        }
        setLoading(false);
    };
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            sx={{ px: "12px", py: "8px" }}
            keepMounted
        >
            <DialogTitle>
                Reauthenticate{" "}
                <Typography fontSize=".7em">
                    {" "}
                    If you don&apos;t have a password (eg: you logged in with
                    google), click the button below anyway.
                </Typography>
            </DialogTitle>
            <DialogContent>
                <InputField
                    label="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    className="mt-2"
                />
                <DialogActions>
                    <LoadingButton
                        loading={loading}
                        type="button"
                        variant="contained"
                        onClick={handleReauthenticate}
                    >
                        <span>Reauthenticate</span>
                    </LoadingButton>
                    <Button
                        type="button"
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}
