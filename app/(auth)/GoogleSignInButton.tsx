"use client";

import React from "react";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "@/firebase";
import { useRouter } from "next/navigation";

type Props = {
    submitted: boolean;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
};

export default function GoogleSignInButton({
    submitted,
    setSubmitted,
    setMessage,
}: Props) {
    const { push } = useRouter();
    return (
        <Button
            type="button"
            startIcon={<FcGoogle />}
            fullWidth
            disabled={submitted}
            variant="contained"
            onClick={async () => {
                setSubmitted(true);
                try {
                    let user = await signInWithGoogle();
                    setMessage(
                        `User ${user?.displayName} created successfully`
                    );
                    setSubmitted(false);
                    return push("/chats");
                } catch (e) {
                    console.log(e);
                    return setSubmitted(false);
                }
            }}
        >
            Sign Up With Google
        </Button>
    );
}
