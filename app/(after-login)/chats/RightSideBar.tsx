"use client";

import {
    Avatar,
    IconButton,
    InputAdornment,
    FilledInput,
    Tab,
    Tabs,
    FormControl,
    Typography,
    InputLabel,
    Tooltip,
    Box,
} from "@mui/material";
import { useState } from "react";
import { LuCopy } from "react-icons/lu";
import HoverWrapper from "./HoverWrapper";

function CustomTabPanel(props: {
    children?: React.ReactNode;
    index: number;
    value: number;
}) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function RightSideBar() {
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const groupURL = "https://localhost:3000/chats/123456789";
    const navigator = globalThis.navigator || null;
    return (
        <div className="w-1/4 max-[712px]:hidden flex justify-start items-start flex-col h-full">
            <div className="w-full overflow-y-auto h-full">
                <Avatar
                    src=""
                    alt="Some Avatar"
                    className="mx-auto mt-6 w-24 h-24"
                />
                <Typography variant="h5" align="center" className="my-2">
                    Shirshen Shuvro
                </Typography>
                <HoverWrapper
                    className="mx-6"
                    style={{
                        width: `calc(100% - 3rem)`,
                    }}
                >
                    <FormControl variant="filled" fullWidth>
                        <InputLabel
                            htmlFor="filled-adornment-password"
                            className="font-bold"
                        >
                            Group Link
                        </InputLabel>
                        <FilledInput
                            value={groupURL}
                            disabled
                            endAdornment={
                                <InputAdornment position="end">
                                    <Tooltip title="Copy">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    groupURL
                                                );
                                            }}
                                            edge="end"
                                        >
                                            <LuCopy />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </HoverWrapper>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <HoverWrapper>
                        <Tab label="Item One" />
                    </HoverWrapper>
                    <Tab label="Item Two" />
                    <Tab label="Item Three" />
                    <Tab label="Item Four" />
                </Tabs>
                <CustomTabPanel index={0} value={value}>
                    item 1
                </CustomTabPanel>
                <CustomTabPanel index={1} value={value}>
                    item 2
                </CustomTabPanel>
                <CustomTabPanel index={2} value={value}>
                    item 3
                </CustomTabPanel>
                <CustomTabPanel index={3} value={value}>
                    item 4
                </CustomTabPanel>
            </div>
        </div>
    );
}
