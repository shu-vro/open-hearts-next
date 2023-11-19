"use client";

import { Paper } from "@mui/material";
import React from "react";
import ReplySection from "./ReplySection";
import { EditImagesForLastTime } from "./EditImagesForLastTime";

type Props = { open: boolean };

export default function MessageFormStack({ open }: Props) {
    return open ? (
        <Paper
            className="absolute bottom-full left-0 w-full py-3 rounded-[.75rem_.75rem_0_0] z-10 flex flex-col"
            elevation={4}
        >
            <EditImagesForLastTime />
            <ReplySection />
        </Paper>
    ) : null;
}
