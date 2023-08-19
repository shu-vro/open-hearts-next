import { TextField, type StandardTextFieldProps } from "@mui/material";
import React from "react";

export default function InputField(
    ...props: (JSX.Element | StandardTextFieldProps)[]
) {
    return (
        <TextField
            type="text"
            variant="outlined"
            aria-describedby={props[0].label || ""}
            sx={{
                mb: 2,
            }}
            fullWidth
            required
            {...props[0]}
        />
    );
}
