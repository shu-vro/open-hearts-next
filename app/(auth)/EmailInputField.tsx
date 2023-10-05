"use client";
import { StandardTextFieldProps } from "@mui/material";
import InputField from "./InputField";
import { useState } from "react";

type Props = {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
} & Partial<StandardTextFieldProps>;

export default function EmailInputField({ email, setEmail, ...rest }: Props) {
    const [emailVerifier, setEmailVerifier] = useState(true);
    return (
        <InputField
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => {
                setEmail(e.target.value);
                setEmailVerifier(() => {
                    return RegExp(
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    ).test(e.target.value);
                });
            }}
            helperText={emailVerifier ? "" : "Email is not well formatted"}
            error={!emailVerifier}
            {...rest}
        />
    );
}
