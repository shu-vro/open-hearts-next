import React, { useState } from "react";
import InputField from "./InputField";
import { testPassword } from "@/lib/utils";
import { StandardTextFieldProps } from "@mui/material";

type Props = {
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
} & StandardTextFieldProps;

export default function PasswordInputField({
    password,
    setPassword,
    ...rest
}: Props) {
    const [passwordPrompt, setPasswordPrompt] = useState(``);
    return (
        <InputField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => {
                setPassword(e.target.value);
                setPasswordPrompt(testPassword(e.target.value));
            }}
            helperText={passwordPrompt}
            error={passwordPrompt !== ""}
            {...rest}
        />
    );
}
