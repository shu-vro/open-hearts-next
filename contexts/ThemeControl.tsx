"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { PaletteMode } from "@mui/material";

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#1E90FF",
        },
        mySwatch: {
            messageBG: "#2a2d3a",
        },
    },
});
export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1E90FF",
        },
        mySwatch: {
            messageBG: "rgb(186 199 255)",
        },
    },
});

type Props = {
    children: React.ReactElement;
    theme: PaletteMode;
};

function App({ children, theme }: Props) {
    return (
        <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
            <CssBaseline /> {children}
        </ThemeProvider>
    );
}

export default App;
