"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

type Props = {
    children: React.ReactElement;
};

function App({ children }: Props) {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline /> {children}
        </ThemeProvider>
    );
}

export default App;
