import { cn } from "@/lib/utils";
import React from "react";

export type HoverWrapperProps = {
    children: React.ReactNode;
    className?: string;
    classNameInner?: string;
    style?: React.CSSProperties;
};

export default function HoverWrapper({
    children,
    className = "",
    classNameInner = "",
    style = {},
}: HoverWrapperProps) {
    return (
        <div
            className={cn("hover-card", "w-fit rounded-lg", className)}
            style={style}
        >
            <div
                className={cn(
                    "hover-card-content",
                    "bg-[color:#e7e7e7] dark:bg-[color:#262626]",
                    classNameInner
                )}
            >
                {children}
            </div>
        </div>
    );
}
