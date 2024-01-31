import { TypographyOwnProps } from "@mui/material";
import MuiMaterialLink from "@mui/material/Link";
import Link, { LinkProps } from "next/link";
import React from "react";

export default function MuiLink({
    ...rest
}: LinkProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement> &
    TypographyOwnProps) {
    return (
        <MuiMaterialLink
            component={Link}
            {...rest}
            underline="hover"
        ></MuiMaterialLink>
    );
}
