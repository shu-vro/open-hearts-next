import MessageContext from "@/contexts/MessageContext";
import React from "react";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";

export default function Layout({ children }: { children: React.ReactElement }) {
    return (
        <div className="w-full grow flex flex-row h-[calc(100%-4rem)]">
            <MessageContext>
                <LeftSideBar />
                {children}
                <RightSideBar />
            </MessageContext>
        </div>
    );
}
