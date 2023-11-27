"use client";

import { MessageType } from "@/app";
import GroupInfo from "../group_info/GroupInfo";
import { useGroup } from "@/contexts/GroupContext";

export default function RightSideBar({
    messages,
}: {
    messages: MessageType[];
}) {
    const { group } = useGroup();
    return (
        <div className="w-1/4 max-[962px]:hidden flex justify-start items-start flex-col h-full">
            <GroupInfo messages={messages} group={group} />
        </div>
    );
}
