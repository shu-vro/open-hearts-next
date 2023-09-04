"use client";

import React from "react";
import AppBarCustom from "./AppBarCustom";

export default function RootLayout({
    children,
}: {
    children: React.ReactElement;
}) {
    return (
        <div className="h-[100vh] w-full flex justify-start flex-col items-start">
            <AppBarCustom />
            {children}
        </div>
    );
}
