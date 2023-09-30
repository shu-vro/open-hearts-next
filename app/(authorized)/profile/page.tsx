import React from "react";
import Canvas3D from "./Canvas3D";
import { Imbue } from "next/font/google";
import { Avatar, Box, Typography } from "@mui/material";
const imbue = Imbue({
    subsets: ["latin"],
    display: "swap",
    weight: ["100"],
});
// Meet [Name], a fantastic friend who's smart, compassionate, and full of life. They bring positivity wherever they go

export default function Page() {
    return (
        <div className={`w-full grow h-[calc(100%-4rem)] ${imbue.className}`}>
            <Box className="chat-section w-full overflow-y-auto h-full relative">
                <Canvas3D />
                <Box
                    className="grid"
                    sx={{
                        fontSize: "clamp(1.5rem, 3vw, 250px)",
                        gridTemplateAreas: `
                        'avatar description'
                        'intro description'
                        'description description'
                    `,
                    }}
                >
                    <Avatar
                        src="https://mui.com/static/images/avatar/3.jpg"
                        alt="Shirshen Shuvro"
                        className="w-full max-w-xs max-h-xs rounded-2xl"
                        sx={{
                            gridArea: "avatar",
                        }}
                    />
                    <div
                        style={{
                            gridArea: "intro",
                        }}
                    >
                        <Typography fontSize={`1rem`}>Meet</Typography>
                        <Typography>Shirshen Shuvro</Typography>
                    </div>
                    <div
                        style={{
                            fontSize: ".9em",
                            gridArea: "description",
                        }}
                    >
                        Meet Shirshen Shuvro, a fantastic friend who&apos;s
                        smart, compassionate, and full of life. They bring
                        positivity wherever they go
                    </div>
                </Box>
            </Box>
        </div>
    );
}
