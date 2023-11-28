"use client";

import { cn } from "@/lib/utils";
import { FormHelperText, Button } from "@mui/material";
import { useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import AlertBox from "../AlertBox";
import EmailInputField from "../EmailInputField";
import { auth, sendPasswordResetEmail } from "@/firebase";
import AuthForm from "../AuthForm";
import MuiLink from "@/app/MuiLink";
import { SITEMAP } from "@/lib/variables";
import { LoadingButton } from "@mui/lab";

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
                url: location.origin + "/chats",
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
            <LoadingButton
                variant="contained"
                onClick={handleSubmit}
                loading={submitted}
                title="You can resend only once. Try reloading the webpage and try again if you don't get password reset email."
            >
                <span>Resend</span>
            </LoadingButton>
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
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        loading={submitted}
                    >
                        <span>Send forgot password email</span>
                    </LoadingButton>
                    <FormHelperText className="text-base italic my-2">
                        Feeling ready?{" "}
                        <MuiLink href={SITEMAP.login}>Log in</MuiLink>
                    </FormHelperText>
                </>
            </AuthForm>
        </>
    );
}
