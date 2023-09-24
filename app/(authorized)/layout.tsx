"use client";

import React from "react";
import AppBarCustom from "./AppBarCustom";

export default function RootLayout({
    children,
}: {
    children: React.ReactElement;
}) {
    return (
        <div
            className="h-[100vh] w-full flex justify-start flex-col items-start hover-card-wrapper"
            onMouseMove={(e) => {
                for (const card of document.getElementsByClassName(
                    "hover-card"
                ) as HTMLCollectionOf<HTMLDivElement>) {
                    const rect = card.getBoundingClientRect(),
                        x = e.clientX - rect.left,
                        y = e.clientY - rect.top;

                    card.style.setProperty("--mouse-x", `${x}px`);
                    card.style.setProperty("--mouse-y", `${y}px`);
                }
            }}
        >
            <AppBarCustom />
            {children}
        </div>
    );
}
