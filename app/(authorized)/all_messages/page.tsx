"use client";

import React, { useState } from "react";
import { NoGroupBanner } from "../chats/LeftSideBar";
import { GroupList } from "./GroupList";
import SpeedDialTooltip from "./SpeedDialTooltip";
import { SpeedDial } from "@mui/material";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { SITEMAP } from "@/lib/variables";
import useFetchGroup from "@/lib/hooks/useFetchGroup";
import SearchGroup from "./SearchGroup";

export default function All_Messages() {
    const groups = useFetchGroup();
    const { push } = useRouter();
    const [searching, setSearching] = useState(false);

    return (
        <div className="w-full flex justify-start items-start flex-col h-full">
            <SearchGroup searching={searching} setSearching={setSearching} />
            <div className="w-full overflow-y-auto h-full mt-3">
                {groups.map((group, i) => (
                    <GroupList key={group.id} group={group} />
                ))}
                {!groups.length && <NoGroupBanner />}
            </div>

            <SpeedDial
                ariaLabel="SpeedDial"
                sx={{ position: "absolute", bottom: 16, right: 16 }}
                icon={<RiArrowGoBackLine />}
                onClick={() => {
                    push(SITEMAP.chats);
                }}
            />
            <SpeedDialTooltip setSearching={setSearching} />
        </div>
    );
}
