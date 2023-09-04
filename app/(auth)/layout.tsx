"use client";

import React from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactElement;
}) {
    return (
        <div className="signup w-[100vw] min-h-[100vh] flex justify-center items-center flex-col relative">
            {children}
        </div>
    );
}
