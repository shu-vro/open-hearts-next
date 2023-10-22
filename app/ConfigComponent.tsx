"use client";

import { useColorMode } from "@/contexts/ColorModeContext";
import useDeviceType from "@/lib/hooks/useDeviceType";
import React, { useEffect } from "react";

export default function ConfigComponent() {
    const { setMode } = useColorMode();
    const deviceType = useDeviceType();
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

        if (!localStorage.doodle) {
            localStorage.doodle = "true";
            document.documentElement.classList.add("doodle");
        } else {
            if (localStorage.doodle === "true") {
                document.documentElement.classList.add("doodle");
            } else {
                document.documentElement.classList.remove("doodle");
            }
        }
    }, []);

    useEffect(() => {
        if (!localStorage.deviceType) {
            localStorage.deviceType = deviceType;
        } else if (localStorage.deviceType !== deviceType) {
            localStorage.deviceType = deviceType;
        }
    }, [deviceType]);

    return <></>;
}
