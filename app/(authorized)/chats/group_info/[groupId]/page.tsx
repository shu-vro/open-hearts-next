"use client";

import { SpeedDial } from "@mui/material";
import GroupInfo from "../GroupInfo";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { SITEMAP } from "@/lib/variables";
import { useGroup } from "@/contexts/GroupContext";
import { useAllMessages } from "@/contexts/AllMessagesContext";
import useGetGroup from "@/lib/hooks/useGetGroup";
import useFetchAllMessages from "@/lib/hooks/useFetchAllMessages";

export default function Page({
    params,
}: {
    params: {
        groupId: string;
    };
}) {
    const { push } = useRouter();
    const { group } = useGroup();
    const { messages } = useAllMessages();
    useGetGroup(params.groupId);
    useFetchAllMessages(params.groupId);

    return (
        <div className="w-full flex justify-start items-start flex-col h-full">
            <GroupInfo group={group} messages={messages} />
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
