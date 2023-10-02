"use client";

import React, { useEffect } from "react";
import AppBarCustom from "./AppBarCustom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";

export default function RootLayout({
    children,
}: {
    children: React.ReactElement;
}) {
    const { push } = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        let unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                push("/login");
            }
        });
        return unsubscribe;
    }, [pathname]);

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
