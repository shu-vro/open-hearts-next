"use client";

import { cn } from "@/lib/utils";
import { FormHelperText, Button } from "@mui/material";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import LinearProgress from "@mui/material/LinearProgress";
import AlertBox from "../AlertBox";
import EmailInputField from "../EmailInputField";
import Link from "next/link";
import { auth } from "@/firebase";
import AuthForm from "../AuthForm";

/**
 * TODO:
 * Add loading screen on account creation - done
 * Add verify password check - done
 * Add redirect if user exists but not verified
 * Add strong password check - half done
 * Add fadeout animation for all page, including this.
 */
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState("");
    const [submittedSuccess, setSubmittedSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
        try {
            await sendPasswordResetEmail(auth, email, {
                url: location.origin + "/chat",
            });
            setSubmitted(false);
            setSubmittedSuccess(true);
        } catch (e) {
            setMessage(JSON.stringify(e, null, 4));
            setSubmitted(false);
        }
    }
    return submittedSuccess ? (
        <h3 className="text-center">
            A Reset Password Email was sent to{" "}
            <a href="https://mail.google.com/">
                {auth.currentUser!?.email || "email"}
            </a>
            . Please change your password there.
            <br />
            Didn&apos;t Receive email?
            <br />
            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitted}
                title="You can resend only once. Try reloading the webpage and try again if you don't get password reset email."
            >
                Resend
            </Button>
        </h3>
    ) : (
        <>
            {submitted && (
                <LinearProgress
                    aria-busy={submitted}
                    sx={{
                        width: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                />
            )}
            <AuthForm onSubmit={handleSubmit}>
                <>
                    <AlertBox setMessage={setMessage} message={message} />
                    <h2 className={cn("text-center m-0 p-0 mb-10")}>
                        Reset Password
                    </h2>
                    <EmailInputField email={email} setEmail={setEmail} />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={submitted}
                    >
                        Send forgot password email
                    </Button>
                    <FormHelperText className="text-base italic my-2">
                        Feeling ready? <Link href="/login">Log in</Link>
                    </FormHelperText>
                </>
            </AuthForm>
        </>
    );
}
