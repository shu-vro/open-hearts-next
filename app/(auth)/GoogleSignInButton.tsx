"use client";

import React from "react";
import { LoadingButton } from "@mui/lab";
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
        <LoadingButton
            type="button"
            startIcon={<FcGoogle />}
            loadingPosition="start"
            fullWidth
            loading={submitted}
            variant="contained"
            onClick={async () => {
                setSubmitted(true);
                try {
                    let user = await signInWithGoogle();
                    setMessage(
                        `User ${user?.displayName} created successfully`
                    );
                    setSubmitted(false);
                    return push(SITEMAP.chats);
                } catch (e) {
                    console.log(
                        `%c${JSON.stringify(e, null, 2)}`,
                        "color: white;background: dodgerblue;border-radius: 5px;padding: 7px;font-size: 1.2em;"
                    );
                    return setSubmitted(false);
                }
            }}
        >
            <span>Sign Up With Google</span>
        </LoadingButton>
    );
}
