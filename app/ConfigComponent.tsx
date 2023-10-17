"use client";

import { useColorMode } from "@/contexts/ColorModeContext";
import React, { useEffect } from "react";

export default function ConfigComponent() {
    const { setMode } = useColorMode();
    useEffect(() => {
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
        if (localStorage.doodle === "true") {
            document.documentElement.classList.add("doodle");
        } else {
            document.documentElement.classList.remove("doodle");
        }
    }, []);

    return <></>;
}
