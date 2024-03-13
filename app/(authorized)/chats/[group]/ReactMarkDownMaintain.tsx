import MuiLink from "@/app/MuiLink";
import { useTheme } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import React from "react";

export default function ReactMarkDownMaintain({
    children,
}: {
    children: string;
}) {
    const {
        palette: { mode },
    } = useTheme();
    return (
        <MDEditor.Markdown
            source={children}
            wrapperElement={{
                "data-color-mode": mode,
            }}
            rehypeRewrite={(node: any, index, parent: any) => {
                if (
                    node.tagName === "a" &&
                    parent &&
                    /^h(1|2|3|4|5|6)/.test(parent.tagName)
                ) {
                    parent.children = parent.children.slice(1);
                }
            }}
            style={{
                // @ts-ignore
                "--color-canvas-default": "none",
                "--color-fg-default": "inherit",
                "--color-border-muted": "currentColor",
                "--color-border-default": "currentColor",
                fontFamily: "inherit",
            }}
            components={{
                a(props) {
                    const { href, children } = props;
                    return (
                        <MuiLink
                            href={href as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                filter: "invert(1)",
                            }}
                        >
                            {children}
                        </MuiLink>
                    );
                },
                img(props) {
                    return (
                        <MuiLink
                            href={props.src as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                maxWidth: "100%",
                            }}
                        >
                            <img
                                src={props.src}
                                alt={props.alt}
                                style={{
                                    maxWidth: "100%",
                                }}
                            />
                        </MuiLink>
                    );
                },
                blockquote(props) {
                    return (
                        <blockquote className="relative ml-4">
                            <div className="absolute left-[-1rem] top-0 w-1 h-full bg-current"></div>
                            {props.children}
                        </blockquote>
                    );
                },

                code(props) {
                    return (
                        <code
                            className={`${props.className} text-black dark:text-white`}
                            style={{
                                whiteSpace: `break-spaces`,
                            }}
                        >
                            {props.children}
                        </code>
                    );
                },
            }}
        />
    );
}
