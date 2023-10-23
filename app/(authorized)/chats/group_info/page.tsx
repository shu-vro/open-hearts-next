"use client";

import { IconButton, SpeedDial } from "@mui/material";
import GroupInfo from "./GroupInfo";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { SITEMAP } from "@/lib/variables";

export default function Page() {
    const { push } = useRouter();
    return (
        <div className="w-full flex justify-start items-start flex-col h-full">
            <GroupInfo />
            <SpeedDial
                ariaLabel="SpeedDial"
                sx={{ position: "absolute", bottom: 16, right: 16 }}
                icon={<RiArrowGoBackLine />}
                onClick={() => {
                    push(SITEMAP.chats);
                }}
            />
        </div>
    );
}
