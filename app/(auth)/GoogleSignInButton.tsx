"use client";

import React from "react";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "@/firebase";
import { useRouter } from "next/navigation";
import { SITEMAP } from "@/lib/variables";

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
                    return push(
                        localStorage.deviceType === "desktop"
                            ? SITEMAP.chats
                            : SITEMAP.all_messages
                    );
                } catch (e) {
                    console.log(
                        `%c${JSON.stringify(e, null, 2)}`,
                        "color: white;background: dodgerblue;border-radius: 5px;padding: 7px;font-size: 1.2em;"
                    );
                    return setSubmitted(false);
                }
            }}
        >
            Sign Up With Google
        </Button>
    );
}
