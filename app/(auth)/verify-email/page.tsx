"use client";

import { auth } from "@/firebase";
import VerifyButton from "../VerifyButton";
import Logout from "../Logout";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function VerifyEmail() {
    const sp = useSearchParams();
    const router = useRouter();
    const [verificationEmailSent, setVerificationEmailSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    useEffect(() => {
        let unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmailVerified(user.emailVerified);
            }
        });
        return unsubscribe;
    }, []);

    if (emailVerified) {
        router.push("/chats");
        return <>Email verified. redirecting to chats.</>;
    }
    return verificationEmailSent ? (
        <h3>
            A verification email was sent to{" "}
            <a href="https://mail.google.com/">
                {auth.currentUser!?.email || "email"}
            </a>
            . Please verify your email.
        </h3>
    ) : (
        <>
            <h1>Dear {auth.currentUser?.displayName || "User"}, </h1>
            <h3>Verify your email by clicking the button below</h3>
            <VerifyButton setVerificationEmailSent={setVerificationEmailSent} redirectTo={sp?.get("redirectTo") || "/chats"} />
            <i>or</i>
            <Logout />
        </>
    );
}
