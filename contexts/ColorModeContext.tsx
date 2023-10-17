"use client";

import { createContext, useContext, useState } from "react";
import ThemeControl from "./ThemeControl";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PaletteMode } from "@mui/material";

interface IColorMode {
    mode?: PaletteMode;
    setMode?: React.Dispatch<React.SetStateAction<PaletteMode>>;
    setMainColor?: React.Dispatch<React.SetStateAction<string>>;
}

const Context = createContext({} as IColorMode);

export function useColorMode() {
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
    const [mainColor, setMainColor] = useState(
        typeof localStorage !== "undefined" && !!localStorage?.mainColor
            ? localStorage.mainColor
            : "#1E90FF"
    );
    return (
        <>
            <Context.Provider value={{ mode, setMode, setMainColor }}>
                <ThemeControl theme={mode} mainColor={mainColor}>
                    {children}
                </ThemeControl>
            </Context.Provider>
        </>
    );
}
