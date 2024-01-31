import React from "react";
import HoverWrapper from "../../HoverWrapper";
import {
    FilledInput,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    Tooltip,
} from "@mui/material";
import { LuCopy } from "react-icons/lu";
import { IGroupDetails } from "@/app";

export default function GroupLink({
    inviteLink,
}: {
    inviteLink: IGroupDetails["inviteLink"];
}) {
    return (
        <HoverWrapper className="mx-4 w-[calc(100%-2.1rem)]">
            <FormControl variant="filled" fullWidth>
                <InputLabel
                    htmlFor="filled-adornment-password"
                    className="font-bold"
                >
                    Group Link
                </InputLabel>
                <FilledInput
                    value={
                        !!location ? location.origin + inviteLink : inviteLink
                    }
                    disabled
                    fullWidth
                    endAdornment={
                        <InputAdornment position="end">
                            <Tooltip title="Copy">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            !!location
                                                ? location.origin +
                                                      (inviteLink || "")
                                                : inviteLink || ""
                                        );
                                    }}
                                    edge="end"
                                >
                                    <LuCopy />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </HoverWrapper>
    );
}
