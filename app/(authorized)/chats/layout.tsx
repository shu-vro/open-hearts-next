"use client";

import AllMessagesContext from "@/contexts/AllMessagesContext";
import GroupContext from "@/contexts/GroupContext";
import React from "react";

export default function Layout({ children }: { children: React.ReactElement }) {
    return (
        <GroupContext>
            <AllMessagesContext>{children}</AllMessagesContext>
        </GroupContext>
    );
}
