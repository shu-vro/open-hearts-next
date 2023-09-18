"use client";

import { cn } from "@/lib/utils";
import { Box, useTheme } from "@mui/material";
import HoverWrapper from "../HoverWrapper";

export default function GroupInfoTab({
    children,
    onClick,
    selected = false,
}: {
    children: React.ReactNode;
    onClick: () => void;
    selected?: boolean;
}) {
    const theme = useTheme();
    return (
        <HoverWrapper
            className={cn(
                "w-full first:rounded-tr-none first:rounded-br-none last:rounded-tl-none last:rounded-bl-none [&:nth-child(2)]:rounded-none cursor-pointer"
            )}
        >
            <Box
                className="text-center uppercase py-2.5 rounded-[inherit]"
                onClick={onClick}
                sx={{
                    bgcolor: (theme) =>
                        selected ? theme.palette.primary.dark : "inherit",
                }}
            >
                {children}
            </Box>
        </HoverWrapper>
    );
}
