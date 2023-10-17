import MuiMaterialLink, { LinkOwnProps } from "@mui/material/Link";
import Link, { LinkProps } from "next/link";

export default function MuiLink({ ...rest }: LinkOwnProps & LinkProps) {
    return <MuiMaterialLink component={Link} {...rest}></MuiMaterialLink>;
}
