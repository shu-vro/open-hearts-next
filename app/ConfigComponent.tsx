"use client";

import { useColorMode } from "@/contexts/ColorModeContext";
import { useTheme } from "@mui/material";
import React, { useEffect } from "react";

export default function ConfigComponent() {
    const theme = useTheme();
    const { setMode } = useColorMode();
    useEffect(() => {
        window.theme = theme;
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
            setMode!("dark");
        } else {
            document.documentElement.classList.remove("dark");
            setMode!("light");
        }
    }, []);

    return <></>;
}
