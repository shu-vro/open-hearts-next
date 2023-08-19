"use client";
import { auth } from "@/firebase.js";
import { sendEmailVerification } from "firebase/auth";
import { Button } from "@mui/material";

type Props = {
    setVerificationEmailSent: React.Dispatch<React.SetStateAction<boolean>>;
    text?: string;
};

export default function VerifyButton({
    text = "Verify Email",
    setVerificationEmailSent,
}: Props) {
    return (
        <Button
            type="button"
            variant="contained"
            onClick={async () => {
                await sendEmailVerification(auth.currentUser!, {
                    url: location.origin + "/chat",
                });
                setVerificationEmailSent(true);
            }}
        >
            {text}
        </Button>
    );
}
