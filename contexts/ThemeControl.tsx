"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

type Props = {
    children: React.ReactElement;
    theme: PaletteMode;
    mainColor: string;
};

function ThemeControl({ children, theme, mainColor }: Props) {
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            primary: {
                main: mainColor,
            },
            mySwatch: {
                messageBG: "#2a2d3a",
            },
        },
    });

    const lightTheme = createTheme({
        palette: {
            mode: "light",
            primary: {
                main: mainColor,
            },
            mySwatch: {
                messageBG: "rgb(186 199 255)",
            },
        },
    });
    return (
        <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
            {children}
        </ThemeProvider>
    );
}

export default ThemeControl;
