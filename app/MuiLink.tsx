import MuiMaterialLink, { LinkOwnProps, LinkTypeMap } from "@mui/material/Link";
import Link, { LinkProps } from "next/link";
import React from "react";

export default function MuiLink({
    ...rest
}: LinkProps & LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return <MuiMaterialLink component={Link} {...rest}></MuiMaterialLink>;
}
