"use client";

import { cn, testPassword } from "@/lib/utils";
import { FormHelperText, Button } from "@mui/material";
import InputField from "../InputField";
// @ts-ignore
import Identicon from "react-identicons";
import { useEffect, useState, useMemo } from "react";
import { createUserWithPassword } from "@/firebase.js";
import { useRouter } from "next/navigation";
import LinearProgress from "@mui/material/LinearProgress";
import EmailInputField from "../EmailInputField";
import PasswordInputField from "../PasswordInputField";
import AlertBox from "../AlertBox";
import GoogleSignInButton from "../GoogleSignInButton";
import Link from "next/link";
import AuthForm from "../AuthForm";

/**
 * TODOS:
 * Add loading screen on account creation - done
 * Add verify password check - done
 * Add redirect if user exists but not verified - done
 * Add strong password check - done
 * Add fadeout animation for all page, including this.
 */
export default function Signup() {
    const [name, setName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
        if (password1 !== password2) {
            setMessage(`OpenHeartsError: Password do not match`);
            return setSubmitted(false);
        }
        let m = testPassword(password1);
        if (!!m) {
            setMessage(m);
            return setSubmitted(false);
        }
        try {
            const user = await createUserWithPassword(
                name,
                photoURL,
                email,
                password1
            );
            setMessage(`User ${user.email} created successfully`);
            setSubmitted(false);
            router.push("/verify-email");
        } catch (e: unknown) {
            setMessage(JSON.stringify(e));
            console.log(e);
            return setSubmitted(false);
        }
    }

    useEffect(() => {
        const canvas = document.querySelector(
            "canvas.identicon"
        ) as HTMLCanvasElement;
        setPhotoURL(canvas.toDataURL("image/png"));
    }, [name]);

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
                    <h2 className={cn("text-center m-0 p-0")}>Sign Up</h2>
                    <Identicon
                        string={name}
                        size="80"
                        className="identicon border border-[#444] border-solid my-4 p-3"
                    />
                    <InputField
                        id="name"
                        type="text"
                        label="Your Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <EmailInputField email={email} setEmail={setEmail} />
                    <PasswordInputField
                        password={password1}
                        setPassword={setPassword1}
                        label="Password"
                    />
                    <PasswordInputField
                        password={password2}
                        setPassword={setPassword2}
                        label="Confirm Password"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={submitted}
                    >
                        Sign Up
                    </Button>
                    <FormHelperText className="text-lg font-bold my-2">
                        Or
                    </FormHelperText>
                    <GoogleSignInButton
                        submitted={submitted}
                        setSubmitted={setSubmitted}
                        setMessage={setMessage}
                    />
                    <p>
                        Been Here Before? <Link href="/login">Login.</Link>
                    </p>
                </>
            </AuthForm>
        </>
    );
}
