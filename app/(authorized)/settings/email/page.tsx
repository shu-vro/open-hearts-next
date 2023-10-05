"use client";

import EmailInputField from "@/app/(auth)/EmailInputField";
import { auth } from "@/firebase";
import { Button } from "@mui/material";
import React, { useState } from "react";
import AlertBox from "@/app/(auth)/AlertBox";
import { signOut, updateEmail } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Email() {
    const router = useRouter();
    const [email, setEmail] = useState(auth.currentUser?.email || "");
    const [message, setMessage] = useState("");
    const [reauthenticate, setReauthenticate] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (auth.currentUser?.email === email) {
            return setMessage("Email Never Changed");
        }
        try {
            if (!auth.currentUser) return setMessage("Current User Not Found");
            await updateEmail(auth.currentUser, email);
            setMessage(
                "Email Updated Successfully. \nNext Step: Validate new email. \nRedirecting to validate-email page"
            );
            setTimeout(() => {
                router.push("/verify-email?redirectTo=/settings/email");
            }, 3500);
        } catch (error: any) {
            if (error.code === "auth/requires-recent-login") {
                setReauthenticate(true);
                return setMessage(
                    "You need to reauthenticate to update your email."
                );
            }
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h1>Change Email</h1>
            <AlertBox message={message} setMessage={setMessage} />
            <EmailInputField
                email={email}
                setEmail={setEmail}
                className="w-[460px] max-w-full mb-4"
            />
            <Button type="submit" variant="contained" className="block">
                Change email
            </Button>
        </form>
    );
}
