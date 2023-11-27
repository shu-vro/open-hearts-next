"use client";
import { auth } from "@/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

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
    const { setMessage } = useToastAlert();
    const [loading, setLoading] = useState(false);
    return (
        <LoadingButton
            type="button"
            variant="contained"
            onClick={async () => {
                setLoading(true);
                try {
                    await sendEmailVerification(auth.currentUser!, {
                        url: location.origin + redirectTo,
                    });
                    setVerificationEmailSent(true);
                } catch (error: any) {
                    console.warn(error);
                    setMessage(
                        "Error: there was an error sending verify email: " +
                            error.message
                    );
                }
                setLoading(false);
            }}
        >
            <span>{text}</span>
        </LoadingButton>
    );
}
