import { MessageType } from "@/app";
import GroupInfo from "../group_info/GroupInfo";

export default function RightSideBar({
    messages,
}: {
    messages: MessageType[];
}) {
    return (
        <div className="w-1/4 max-[962px]:hidden flex justify-start items-start flex-col h-full">
            <GroupInfo messages={messages} />
        </div>
    );
}
