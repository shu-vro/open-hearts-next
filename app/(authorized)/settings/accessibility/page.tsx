"use client";

import React, { useState } from "react";
import { Switch, Typography, useTheme } from "@mui/material";
import { useColorMode } from "@/contexts/ColorModeContext";

let timeout: NodeJS.Timeout | null;

export default function Accessibility() {
    const theme = useTheme();
    const { mode, setMode, setMainColor } = useColorMode();
    const [bgDoodle, setBgDoodle] = useState(localStorage.doodle === "true");

    return (
        <div>
            <h1>Accessibility</h1>
            <SettingsList>
                <>
                    <Typography variant="h5">Dark Mode</Typography>
                    <Switch
                        checked={mode === "dark"}
                        onChange={() => {
                            if (mode === "dark") {
                                document.documentElement.classList.remove(
                                    "dark"
                                );
                                localStorage.theme = "light";
                                setMode!("light");
                                return;
                            }
                            document.documentElement.classList.add("dark");
                            localStorage.theme = "dark";
                            setMode!("dark");
                        }}
                    />
                </>
            </SettingsList>
            <SettingsList>
                <>
                    <Typography variant="h5">Main Color</Typography>
                    <input
                        type="color"
                        onChange={(e) => {
                            if (timeout) {
                                return;
                            }
                            timeout = setTimeout(() => {
                                localStorage.mainColor = e.target.value;
                                setMainColor!(e.target.value);

                                clearTimeout(timeout!);
                                timeout = null;
                            }, 1000);
                        }}
                        defaultValue={theme.palette.primary.main}
                    />
                </>
            </SettingsList>
            <SettingsList>
                <>
                    <Typography variant="h5">Background Doodle</Typography>

                    <Switch
                        checked={bgDoodle}
                        onChange={() => {
                            setBgDoodle((prev) => {
                                if (!prev) {
                                    document.documentElement.classList.add(
                                        "doodle"
                                    );
                                    localStorage.doodle = true;
                                } else {
                                    document.documentElement.classList.remove(
                                        "doodle"
                                    );
                                    localStorage.doodle = false;
                                }
                                return !prev;
                            });
                        }}
                    />
                </>
            </SettingsList>
        </div>
    );
}

function SettingsList({ children }: { children: React.ReactElement }) {
    return (
        <div className="border-b border-0 border-solid border-gray-300 dark:border-gray-600 w-[460px] max-w-full mb-4 flex justify-between items-center flex-row">
            {children}
        </div>
    );
}
