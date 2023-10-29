"use client";

import EmailInputField from "@/app/(auth)/EmailInputField";
import { auth, firestoreDb } from "@/firebase";
import { Button } from "@mui/material";
import React, { useState } from "react";
import AlertBox from "@/app/(auth)/AlertBox";
import { updateEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import ReauthenticateDialog from "../ReauthenticateDialog";
import { DATABASE_PATH, SITEMAP } from "@/lib/variables";
import { doc, setDoc } from "firebase/firestore";

export default function Email() {
    const router = useRouter();
    const [email, setEmail] = useState(auth.currentUser?.email || "");
    const [message, setMessage] = useState("");
    const [reauthenticate, setReauthenticate] = useState(false);
    const handleSubmit = async () => {
        if (auth.currentUser?.email === email) {
            return setMessage("Email Never Changed");
        }
        if (!auth.currentUser) return setMessage("Current User Not Found");
        try {
            await updateEmail(auth.currentUser, email);
            await setDoc(
                doc(firestoreDb, DATABASE_PATH.users, auth.currentUser.uid),
                { email },
                { merge: true }
            );
            setMessage(
                "Email Updated Successfully. \nNext Step: Validate new email. \nRedirecting to validate-email page"
            );
            setTimeout(() => {
                router.push(
                    `${SITEMAP.verify_email}?redirectTo=/settings/email`
                );
            }, 3500);
        } catch (error: any) {
            setMessage("error occurred at authorized/settings/email");
            console.log(
                "%cError occurred at authorized/settings/email",
                "color: white;background: dodgerblue;border-radius: 5px;padding: 7px;font-size: 2em;"
            );
            if (error.code === "auth/requires-recent-login") {
                setReauthenticate(true);
                return setMessage(
                    "warning: You need to reauthenticate to update your email."
                );
            } else if (error.code === "auth/email-already-in-use") {
                return setMessage("warning: Email is already in use");
            } else if (error.code === "auth/auth/invalid-email") {
                return setMessage("warning: Email is not valid");
            }
        }
    };
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <h1>Change Email</h1>
            <AlertBox message={message} setMessage={setMessage} />
            <EmailInputField
                email={email}
                setEmail={setEmail}
                className="w-[460px] max-w-full mb-4"
            />
            <Button
                type="submit"
                variant="contained"
                className="block mb-4"
                disabled={reauthenticate}
            >
                Change email
            </Button>

            <ReauthenticateDialog
                handleSubmit={handleSubmit}
                open={reauthenticate}
                setOpen={setReauthenticate}
            />
        </form>
    );
}
