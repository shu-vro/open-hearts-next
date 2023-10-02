"use client";

import { cn } from "@/lib/utils";
import { FormHelperText, Button } from "@mui/material";
import { useState } from "react";
import { loginWithPassword } from "@/firebase";
import { useRouter } from "next/navigation";
import LinearProgress from "@mui/material/LinearProgress";
import AlertBox from "../AlertBox";
import PasswordInputField from "../PasswordInputField";
import EmailInputField from "../EmailInputField";
import GoogleSignInButton from "../GoogleSignInButton";
import Link from "next/link";
import AuthForm from "../AuthForm";

/**
 * TODO:
 * Add loading screen on account creation - done
 * Add verify password check - done
 * Add redirect if user exists but not verified
 * Add strong password check - half done
 * Add fadeout animation for all page, including this.
 */
export default function Login() {
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
        try {
            const user = await loginWithPassword(email, password1);
            setMessage(`User ${email} login successfully`);
            setSubmitted(false);
            if (!user!.emailVerified) {
                return router.push("/verify-email");
            }
            return router.push("/chats");
        } catch (e: unknown) {
            setMessage(e as string);
            console.log(e);
            return setSubmitted(false);
        }
    }
    return (
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
                    <h2 className={cn("text-center m-0 p-0 mb-10")}>Login</h2>
                    <EmailInputField email={email} setEmail={setEmail} />
                    <PasswordInputField
                        password={password1}
                        setPassword={setPassword1}
                        label="Password"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={submitted}
                    >
                        Login
                    </Button>
                    <FormHelperText className="text-lg font-bold my-2">
                        Or
                    </FormHelperText>
                    <GoogleSignInButton
                        submitted={submitted}
                        setSubmitted={setSubmitted}
                        setMessage={setMessage}
                    />
                    <FormHelperText className="text-base italic my-2">
                        <Link href="/forgot-password">forgot password?</Link>
                    </FormHelperText>
                    <FormHelperText className="text-base italic my-2">
                        New Here? <Link href="/signup">Sign Up</Link>
                        <Link href="/chats">Chat</Link>
                    </FormHelperText>
                </>
            </AuthForm>
        </>
    );
}
