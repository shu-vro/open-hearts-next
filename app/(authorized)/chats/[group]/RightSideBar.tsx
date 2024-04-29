"use client";

import GroupInfo from "../group_info/GroupInfo";
import { useGroup } from "@/contexts/GroupContext";
import { useAllMessages } from "@/contexts/AllMessagesContext";

export default function RightSideBar() {
    const { group } = useGroup();
    const { messages } = useAllMessages();
    return (
        <div className="w-1/4 max-[962px]:hidden flex justify-start items-start flex-col h-full">
            <GroupInfo messages={messages} group={group} />
        </div>
    );
}
