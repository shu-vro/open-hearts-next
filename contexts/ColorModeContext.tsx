"use client";

import { createContext, useContext, useState } from "react";
import ThemeControl from "./ThemeControl";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PaletteMode } from "@mui/material";

const Context = createContext({});

export function useColorMode(): {
    mode?: PaletteMode;
    setMode?: React.Dispatch<React.SetStateAction<PaletteMode>>;
} {
    return useContext(Context);
}

export function ColorModeContext({
    children,
}: {
    children: React.ReactElement;
}) {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [mode, setMode] = useState<PaletteMode>(
        prefersDarkMode ? "dark" : "light"
    );
    return (
        <>
            <Context.Provider value={{ mode, setMode }}>
                <ThemeControl theme={mode}>{children}</ThemeControl>
            </Context.Provider>
        </>
    );
}
