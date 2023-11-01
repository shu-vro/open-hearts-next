"use client";

import useFetchGroup from "@/lib/hooks/useFetchGroup";
import { GroupList } from "../all_messages/GroupList";
import TopBarAllMessage from "../all_messages/TopBarAllMessage";
import { useState } from "react";
import SearchGroup from "../all_messages/SearchGroup";

export default function LeftSideBar() {
    const groups = useFetchGroup();
    const [searching, setSearching] = useState(false);

    return (
        <div className="w-1/4 max-[962px]:hidden flex justify-start items-start flex-col h-full relative">
            <TopBarAllMessage setSearching={setSearching} />
            <SearchGroup searching={searching} setSearching={setSearching} />
            <div className="w-full overflow-y-auto h-full mt-3">
                {groups.map((group, i) => (
                    <GroupList key={group.id} group={group} />
                ))}
                {!groups.length && <NoGroupBanner />}
            </div>
        </div>
    );
}

export function NoGroupBanner() {
    return (
        <div className="w-full h-full flex justify-center items-center flex-col">
            <div className="text-[max(3vw,3vh)] text-center">
                ¯\_( ͡° ͜ʖ ͡°)_/¯ T
            </div>
            <span className="text-center capitalize">
                Groups you are added will appear here
            </span>
        </div>
    );
}
