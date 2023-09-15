import { TextField, type StandardTextFieldProps } from "@mui/material";
import React from "react";

export default function InputField({
    ...rest
}: { label: string } & StandardTextFieldProps) {
    return (
        <TextField
            type="text"
            variant="outlined"
            aria-describedby={rest.label || ""}
            sx={{
                mb: 2,
            }}
            fullWidth
            required
            {...rest}
        />
    );
}
