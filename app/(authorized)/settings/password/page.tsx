"use client";

import { auth } from "@/firebase";
import { Button } from "@mui/material";
import React, { useState } from "react";
import AlertBox from "@/app/(auth)/AlertBox";
import { updatePassword } from "firebase/auth";
import ReauthenticateDialog from "../ReauthenticateDialog";
import PasswordInputField from "@/app/(auth)/PasswordInputField";
import { testPassword } from "@/lib/utils";

export default function Password() {
    const [password, setPassword] = useState("");
    const [reenterPassword, setReenterPassword] = useState("");
    const [message, setMessage] = useState("");
    const [reauthenticate, setReauthenticate] = useState(false);

    const handleSubmit = async () => {
        if (!auth.currentUser) return setMessage("Current User Not Found");
        if (password !== reenterPassword) {
            return setMessage("Passwords don't match!");
        }

        let m = testPassword(password);
        if (!!m) {
            return setMessage(m);
        }
        try {
            await updatePassword(auth.currentUser, password);
            setMessage("Password Updated Successfully");
        } catch (error: any) {
            if (error.code === "auth/requires-recent-login") {
                setReauthenticate(true);
                return setMessage(
                    "You need to reauthenticate to update your email."
                );
            }
            if (error.code === "auth/weak-password") {
                return setMessage("Make a stronger password");
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
            <h1>Change Password</h1>
            <AlertBox message={message} setMessage={setMessage} />
            <PasswordInputField
                password={password}
                setPassword={setPassword}
                className="w-[460px] max-w-full mb-4 block"
            />
            <PasswordInputField
                password={reenterPassword}
                setPassword={setReenterPassword}
                className="w-[460px] max-w-full mb-4 block"
                label="Reenter Password"
            />
            <Button
                type="submit"
                variant="contained"
                className="block mb-4"
                disabled={reauthenticate}
            >
                Change password
            </Button>

            <ReauthenticateDialog
                handleSubmit={handleSubmit}
                open={reauthenticate}
                setOpen={setReauthenticate}
            />
        </form>
    );
}
