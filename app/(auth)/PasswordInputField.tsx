import React, { useState } from "react";
import InputField from "./InputField";
import { testPassword } from "@/lib/utils";

type Props = {
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    label: string;
};

export default function PasswordInputField({
    password,
    setPassword,
    label,
}: Props) {
    const [passwordPrompt, setPasswordPrompt] = useState(``);
    return (
        <InputField
            id="password"
            type="password"
            label={label}
            value={password}
            onChange={(e) => {
                setPassword(e.target.value);
                setPasswordPrompt(testPassword(e.target.value));
            }}
            helperText={passwordPrompt}
            error={passwordPrompt !== ""}
        />
    );
}
