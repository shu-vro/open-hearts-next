"use client";

import React, { useEffect, useState } from "react";
import Canvas3D from "./Canvas3D";
import { Imbue } from "next/font/google";
import { Avatar, Box, Typography } from "@mui/material";
import { auth, firestoreDb } from "@/firebase";
import { FaRegHandPointRight } from "react-icons/fa";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { DATABASE_PATH } from "@/lib/utils";

const imbue = Imbue({
    subsets: ["latin"],
    display: "swap",
    weight: ["100", "600"],
});
// Meet [Name], a fantastic friend who's smart, compassionate, and full of life. They bring positivity wherever they go

export default function Page() {
    const [userData, setUserData] = useState<DocumentData>();
    useEffect(() => {
        (async () => {
            try {
                if (!auth.currentUser) return;
                const document = await getDoc(
                    doc(firestoreDb, DATABASE_PATH.users, auth.currentUser.uid)
                );
                setUserData(document.data());
            } catch (e) {
                console.log(
                    `%c${JSON.stringify(e, null, 2)}`,
                    "color: white;background: dodgerblue;border-radius: 5px;padding: 7px;font-size: 1em;"
                );
            }
        })();
    }, []);

    return (
        <div
            className={`w-full grow h-[calc(100%-4rem)] dark:text-[bisque] select-none pb-8 ${imbue.className}`}
        >
            <Box className="chat-section overflow-y-auto h-full relative p-4">
                <Canvas3D />
                <Box
                    className="flex w-full justify-center items-center flex-row max-[600px]:flex-col gap-6"
                    sx={{
                        fontSize: "clamp(3rem, 6vw, 350px)",
                    }}
                >
                    <Box className="flex justify-start items-start flex-col">
                        <Avatar
                            src={userData?.photoURL || ""}
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
                                {userData?.name || ""}
                            </Typography>
                        </div>
                    </Box>
                    <div className="capitalize text-[1.5em] leading-[1.2] text-justify">
                        {userData?.description || ""}
                    </div>
                </Box>
                <Box className="ml-20 max-[811px]:ml-0">
                    {Array(5)
                        .fill("")
                        .map((_, i) => (
                            <Box
                                className="list text-[2rem] flex justify-start items-center flex-row mb-4 px-2 group rounded-md max-sm:bg-white max-sm:bg-opacity-20"
                                key={i}
                            >
                                <FaRegHandPointRight className="group-hover:ml-4 max-[811px]:group-hover:ml-0 duration-500" />
                                <b>Hometown: </b>
                                <span className="ml-4">
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
