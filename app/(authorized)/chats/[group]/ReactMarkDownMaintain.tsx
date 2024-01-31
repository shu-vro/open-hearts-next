import Link from "next/link";
import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ReactMarkDownMaintain({
    children,
}: {
    children: string;
}) {
    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
                a(props) {
                    const { href, children } = props;
                    return (
                        <Link
                            href={href as string}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </Link>
                    );
                },
                img(props) {
                    return (
                        <Link
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
                        </Link>
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
            }}
        >
            {children}
        </Markdown>
    );
}
