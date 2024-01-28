"use client";

import { cn, testPassword } from "@/lib/utils";
import { FormHelperText } from "@mui/material";
import InputField from "../InputField";
// @ts-ignore
import Identicon from "react-identicons";
import { useEffect, useState, useMemo } from "react";
import { createUserWithPassword } from "@/firebase";
import { useRouter } from "next/navigation";
import LinearProgress from "@mui/material/LinearProgress";
import EmailInputField from "../EmailInputField";
import PasswordInputField from "../PasswordInputField";
import AlertBox from "../AlertBox";
import GoogleSignInButton from "../GoogleSignInButton";
import AuthForm from "../AuthForm";
import MuiLink from "@/app/MuiLink";
import { SITEMAP } from "@/lib/variables";
import { LoadingButton } from "@mui/lab";
import GenerateAvatar from "./GenerateAvatar";

export default function SignUp() {
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
            setMessage(`PasswordError: Password do not match`);
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

            if (typeof user !== "string") {
                setMessage(`User ${user!.email} created successfully`);
                setSubmitted(false);
            } else {
                setMessage("error: " + user);
                setSubmitted(false);
            }
            router.push(SITEMAP.verify_email);
        } catch (e: unknown) {
            setMessage(JSON.stringify(e));
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
                    <h2 className={cn("text-center m-0 p-0")}>Sign Up</h2>
                    <GenerateAvatar setPhotoURL={setPhotoURL} />
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
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        loading={submitted}
                    >
                        <span>Sign Up</span>
                    </LoadingButton>
                    <FormHelperText className="text-lg font-bold my-2">
                        Or
                    </FormHelperText>
                    <GoogleSignInButton
                        submitted={submitted}
                        setSubmitted={setSubmitted}
                        setMessage={setMessage}
                    />
                    <p>
                        Been Here Before?{" "}
                        <MuiLink href={SITEMAP.login}>Login.</MuiLink>
                    </p>
                </>
            </AuthForm>
        </>
    );
}
