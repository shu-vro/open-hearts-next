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
        <div className={cn("hover-card", className)} style={style}>
            <div className={cn("hover-card-content", classNameInner)}>
                {children}
            </div>
        </div>
    );
}
