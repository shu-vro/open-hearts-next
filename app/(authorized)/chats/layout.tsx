"use client";

import GroupContext from "@/contexts/GroupContext";
import React from "react";

export default function Layout({ children }: { children: React.ReactElement }) {
    return <GroupContext>{children}</GroupContext>;
}
