"use client";

import { useColorMode } from "@/contexts/ColorModeContext";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ConfigComponent() {
    const { setMode } = useColorMode();
    const { push } = useRouter();
    useEffect(() => {
        let unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user && process.env.NODE_ENV !== "development") {
                push("/login");
            }
        });
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
        return unsubscribe;
    }, []);

    return <></>;
}
