"use client";

import React, { useState } from "react";
import { Switch, Typography, useTheme } from "@mui/material";
import { useColorMode } from "@/contexts/ColorModeContext";
import MuiLink from "@/app/MuiLink";
import { LuExternalLink } from "react-icons/lu";

let timeout: NodeJS.Timeout | null;

export default function Accessibility() {
    const theme = useTheme();
    const { mode, setMode, setMainColor } = useColorMode();
    const [bgDoodle, setBgDoodle] = useState(localStorage.doodle === "true");
    const [proEditor, setProEditor] = useState(!!localStorage.proEditor);
    const [
        DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN,
        setDO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN,
    ] = useState(!!localStorage.DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN);

    return (
        <div>
            <h1>Accessibility</h1>
            <p className="text-gray-600 dark:text-gray-400">
                Settings are saved in device.
            </p>
            <SettingsList>
                <Typography variant="h5">Dark Mode</Typography>
                <Switch
                    checked={mode === "dark"}
                    onChange={() => {
                        if (mode === "dark") {
                            document.documentElement.classList.remove("dark");
                            localStorage.theme = "light";
                            setMode!("light");
                            return;
                        }
                        document.documentElement.classList.add("dark");
                        localStorage.theme = "dark";
                        setMode!("dark");
                    }}
                />
            </SettingsList>
            <SettingsList>
                <Typography
                    variant="h5"
                    component={"label"}
                    htmlFor="color_picker"
                >
                    Main Color
                </Typography>
                <input
                    type="color"
                    id="color_picker"
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
            </SettingsList>
            <SettingsList>
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
            </SettingsList>
            <SettingsList>
                <Typography variant="h6">
                    Do not show <i>Confirm to delete all images</i> Modal
                </Typography>

                <Switch
                    checked={DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN}
                    onChange={() => {
                        if (localStorage.DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN) {
                            localStorage.removeItem(
                                "DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN"
                            );
                        } else {
                            localStorage.DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN =
                                "true";
                        }
                        setDO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN(
                            !DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN
                        );
                    }}
                />
            </SettingsList>
            <SettingsList>
                <Typography
                    variant="h5"
                    component={MuiLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={"https://uiwjs.github.io/react-md-editor/"}
                >
                    Pro Message Editor <LuExternalLink />
                </Typography>

                <Switch
                    checked={proEditor}
                    onChange={() => {
                        setProEditor((prev) => {
                            if (!prev) {
                                localStorage.proEditor = true;
                            } else {
                                localStorage.removeItem("proEditor");
                            }
                            return !prev;
                        });
                    }}
                />
            </SettingsList>
            {/* ADD ANOTHER SETTINGS THAT WILL TOGGLE IF USER WANTS TO AUTOMATICALLY JOIN IN GROUP OR NEEDS CONFIRMATION */}
            {/* IN EITHER CASE, THEY ARE GETTING A NOTIFICATION */}
            {/* <SettingsList>
                <Typography variant="h6">
                    Do not show <i>Confirm to delete all images</i> Modal
                </Typography>

                <Switch
                    checked={DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN}
                    onChange={() => {
                        if (localStorage.DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN) {
                            localStorage.removeItem(
                                "DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN"
                            );
                        } else {
                            localStorage.DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN =
                                "true";
                        }
                        setDO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN(
                            !DO_NOT_SHOW_DELETE_ALL_IMAGES_AGAIN
                        );
                    }}
                />
            </SettingsList> */}
        </div>
    );
}

function SettingsList({ children }: { children: React.ReactNode }) {
    return (
        <div className="border-b border-0 border-solid border-gray-300 dark:border-gray-600 w-[460px] max-w-full mb-4 flex justify-between items-center flex-row">
            {children}
        </div>
    );
}
