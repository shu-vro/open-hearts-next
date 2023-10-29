"use client";

import React, { useEffect, useState } from "react";
import Canvas3D from "./Canvas3D";
import { Imbue } from "next/font/google";
import { Avatar, Box, Typography } from "@mui/material";
import { auth, firestoreDb } from "@/firebase";
import { FaRegHandPointRight } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { DATABASE_PATH } from "@/lib/variables";
import { useSearchParams } from "next/navigation";
import { UserType } from "@/app";
import { MAIL_REGEX, URL_REGEX } from "@/lib/utils";

const imbue = Imbue({
    subsets: ["latin"],
    display: "swap",
    weight: ["100", "600"],
});

/**
 * if url have a uid, then go to that uid.
 * if it doesn't, show user's profile
 * if url have a uid but it's not valid,
 *      say sorry to user and request him to go back
 */

export default function Page() {
    const searchParam = useSearchParams();
    const [userData, setUserData] = useState<UserType>();
    useEffect(() => {
        (async () => {
            try {
                let uid: string | null | undefined = auth.currentUser?.uid;
                if (!auth.currentUser) {
                    if (searchParam && searchParam.get("uid") !== null) {
                        uid = searchParam.get("uid");
                    }
                    return;
                }
                const document = await getDoc(
                    doc(firestoreDb, DATABASE_PATH.users, uid || "")
                );
                setUserData(document.data() as UserType);
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
                            className="w-full max-w-xs max-h-xs min-w-[300px] min-h-[300px] h-fit rounded-2xl"
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
                    {userData?.email && (
                        <ListItem key_="Email" value={userData.email} />
                    )}
                    {userData?.hometown && (
                        <ListItem key_="Hometown" value={userData.hometown} />
                    )}
                    {userData?.works.map((work, i) => (
                        <ListItem key_="Works at" value={work} key={i} />
                    ))}
                    {userData?.studies.map((study, i) => (
                        <ListItem key_="Studies at" value={study} key={i} />
                    ))}
                    {Object.entries(userData?.contacts || {}).map(
                        ([key, value], i) => (
                            <ListItem key_={key} value={value} key={i} />
                        )
                    )}
                </Box>
            </Box>
        </div>
    );
}

function ListItem({ key_, value }: { key_: string; value: string }) {
    let refinedValue: React.ReactNode = "";
    if (value.match(MAIL_REGEX)) {
        refinedValue = (
            <a
                href={`mailto:${value}`}
                className="underline text-inherit"
                target="_blank"
                rel="noopener noreferrer"
            >
                {value}
            </a>
        );
    } else if (value.match(URL_REGEX)) {
        refinedValue = (
            <a
                href={value}
                className="underline text-inherit"
                target="_blank"
                rel="noopener noreferrer"
            >
                {value}
            </a>
        );
    } else if (value.match(/\d{4,15}/)) {
        refinedValue = (
            <a
                href={`tel:${value}`}
                className="underline text-inherit"
                target="_blank"
                rel="noopener noreferrer"
            >
                {value}
            </a>
        );
    } else {
        refinedValue = value;
    }
    return (
        <Box className="list text-[2rem] flex justify-start items-center flex-row mb-4 px-2 group rounded-md max-sm:bg-white max-sm:bg-opacity-20">
            <FaRegHandPointRight className="group-hover:ml-4 max-[811px]:group-hover:ml-0 duration-500" />
            <b className="ml-3">{key_}: </b>
            <span className="ml-4">{refinedValue}</span>
        </Box>
    );
}
