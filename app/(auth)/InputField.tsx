import { TextField, type TextFieldProps } from "@mui/material";
import React from "react";

export default function InputField({ ...rest }: Partial<TextFieldProps>) {
    return (
        // @ts-ignore
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
