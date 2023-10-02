import GroupInfo from "./group_info/GroupInfo";

export default function RightSideBar() {
    return (
        <div className="w-1/4 max-[962px]:hidden flex justify-start items-start flex-col h-full">
            <GroupInfo />
        </div>
    );
}
