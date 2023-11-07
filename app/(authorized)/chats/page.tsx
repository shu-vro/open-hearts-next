"use client";

import React, { useState } from "react";
import { NoGroupBanner } from "./[group]/LeftSideBar";
import { GroupList } from "./GroupList";
import SpeedDialTooltip from "./SpeedDialTooltip";
import { SpeedDial } from "@mui/material";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { SITEMAP } from "@/lib/variables";
import useFetchGroups from "@/lib/hooks/useFetchGroups";
import SearchGroup from "./SearchGroup";

export default function Chats() {
    const groups = useFetchGroups();
    const { push } = useRouter();
    const [searching, setSearching] = useState(false);
    const [searchGroup, setSearchGroup] = useState(/.*/g);

    return (
        <div className="w-full flex justify-start items-start flex-col h-full">
            <SearchGroup
                searching={searching}
                setSearching={setSearching}
                setSearchGroup={setSearchGroup}
            />
            <div className="w-full overflow-y-auto h-full mt-3">
                {groups
                    .filter((e) => e.name.search(searchGroup) > -1)
                    .map((group) => (
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
