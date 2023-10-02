import React from "react";
import Canvas3D from "./Canvas3D";
import { Imbue } from "next/font/google";
import { Avatar, Box, Typography } from "@mui/material";
import { BsChevronCompactRight } from "react-icons/bs";
import { FaRegHandPointRight } from "react-icons/fa";
const imbue = Imbue({
    subsets: ["latin"],
    display: "swap",
    weight: ["100", "600"],
});
// Meet [Name], a fantastic friend who's smart, compassionate, and full of life. They bring positivity wherever they go

export default function Page() {
    return (
        <div
            className={`w-full grow h-[calc(100%-4rem)] dark:text-[bisque] select-none pb-8 ${imbue.className}`}
        >
            <Box className="chat-section w-full overflow-y-auto h-full relative p-4">
                <Canvas3D />
                <Box
                    className="flex w-full justify-center items-center flex-row gap-6"
                    sx={{
                        fontSize: "clamp(3rem, 6vw, 350px)",
                    }}
                >
                    <Box className="flex justify-start items-start flex-col">
                        <Avatar
                            src="https://mui.com/static/images/avatar/3.jpg"
                            alt="Shirshen Shuvro"
                            className="w-full max-w-xs max-h-xs min-w-[200px] min-h-[200px] h-fit rounded-2xl"
                        />
                        <div>
                            <Typography
                                fontFamily="inherit"
                                fontSize={`.6em`}
                                className="leading-[0] mt-[1.2em]"
                            >
                                Meet
                            </Typography>
                            <Typography
                                fontFamily="inherit"
                                fontSize="inherit"
                                fontWeight="600"
                            >
                                Shirshen Shuvro
                            </Typography>
                        </div>
                    </Box>
                    <div className="capitalize text-[1.5em] leading-[1.2] text-justify">
                        a fantastic friend who&apos;s smart, compassionate, and
                        full of life. They bring positivity wherever they go
                    </div>
                </Box>
                <Box className="ml-20 max-[811px]:ml-0">
                    {Array(5)
                        .fill("")
                        .map((_, i) => (
                            <Box
                                className="list text-[2rem] flex justify-start items-center flex-row gap-4 group"
                                key={i}
                            >
                                <FaRegHandPointRight className="group-hover:ml-4 max-[811px]:group-hover:ml-0 duration-500" />
                                <b>Hometown: </b>
                                <span>
                                    Lorem ipsum, dolor sit amet consectetur
                                    adipisicing elit.
                                </span>
                            </Box>
                        ))}
                </Box>
            </Box>
        </div>
    );
}
