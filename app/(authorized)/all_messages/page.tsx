"use client";

import React from "react";
import { FriendList } from "../chats/LeftSideBar";
import { SpeedDial } from "@mui/material";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

export default function All_Messages() {
    const { push } = useRouter();
    return (
        <div className="w-full flex justify-start items-start flex-col h-full">
            <div className="w-full overflow-y-auto h-full">
                {Array(20)
                    .fill("")
                    .map((_, i) => (
                        <FriendList key={i} />
                    ))}
            </div>

            <SpeedDial
                ariaLabel="SpeedDial"
                sx={{ position: "absolute", bottom: 16, right: 16 }}
                icon={<RiArrowGoBackLine />}
                onClick={() => {
                    push("/chats");
                }}
            />
        </div>
    );
}
