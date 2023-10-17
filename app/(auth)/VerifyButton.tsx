"use client";
import { auth } from "@/firebase";
import { sendEmailVerification } from "firebase/auth";
import { Button } from "@mui/material";

type Props = {
    setVerificationEmailSent: React.Dispatch<React.SetStateAction<boolean>>;
    text?: string;
    redirectTo?: string;
};

export default function VerifyButton({
    text = "Verify Email",
    redirectTo = "/chats",
    setVerificationEmailSent,
}: Props) {
    return (
        <Button
            type="button"
            variant="contained"
            onClick={async () => {
                try {
                    await sendEmailVerification(auth.currentUser!, {
                        url: location.origin + redirectTo,
                    });
                    setVerificationEmailSent(true);
                } catch (error: any) {
                    console.warn(error);
                    alert(
                        "there was an error sending verify email: " +
                            error.message
                    );
                }
            }}
        >
            {text}
        </Button>
    );
}
