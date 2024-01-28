"use client";

import AllMessagesContext from "@/contexts/AllMessagesContext";
import GroupContext from "@/contexts/GroupContext";
import UsersInGroupContext from "@/contexts/UsersInGroupContext";
import React from "react";

export default function Layout({ children }: { children: React.ReactElement }) {
    return (
        <GroupContext>
            <AllMessagesContext>
                <UsersInGroupContext>{children}</UsersInGroupContext>
            </AllMessagesContext>
        </GroupContext>
    );
}
