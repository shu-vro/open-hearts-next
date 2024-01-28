"use client";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Badge, IconButton, styled, useTheme } from "@mui/material";
import { BsCheck2All } from "react-icons/bs";
import { cn, repeat } from "@/lib/utils";
import MuiLink from "@/app/MuiLink";
import { type Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import HoverWrapper from "../HoverWrapper";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";

dayjs.extend(relativeTime);

type Props = {
    name: string;
    photoURL: string;
    time: Timestamp;
    description: string;
    url: string;
    seenData: boolean;
    iconOnly?: boolean;
    loading: boolean;
    onClick: (e: any) => any;
    extraButtons?: any[];
};

export function ExtraButton(
    props: LoadingButtonProps & React.HTMLProps<HTMLButtonElement>
) {
    return (
        <LoadingButton
            type="button"
            size="small"
            variant="outlined"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            {...props}
        >
            {props.children}
        </LoadingButton>
    );
}

export default function Notification({
    description,
    name,
    photoURL,
    time,
    url,
    seenData,
    onClick,
    iconOnly = false,
    loading,
    extraButtons = [],
}: Props) {
    const theme = useTheme();
    const matches668 = useMediaQuery("(min-width:668px)");
    const matches438 = useMediaQuery("(min-width:438px)");

    const handleMarkAsRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onClick(e);
    };

    return (
        <HoverWrapper
            className="mx-8 w-full max-[438px]:mx-2 first:mt-4"
            style={{
                width: matches438 ? "calc(100% - 5rem)" : "calc(100% - 1.5rem)",
                pointerEvents: loading ? "none" : "auto",
                userSelect: loading ? "none" : "all",
            }}
        >
            <MuiLink
                href={url}
                className={cn(
                    "grid hover:no-underline rounded-[inherit]",
                    "max-[538px]:text-[10px] max-[900px]:text-sm px-3 py-2",
                    (seenData || loading) && "opacity-60"
                )}
                style={{
                    textDecoration: "none",
                    color: theme.palette.text.primary,
                    background:
                        theme.palette.mode === "dark"
                            ? "linear-gradient(to bottom, #252525 50%, #2a2a2a 100%)"
                            : `#d2d9ff`,
                    gridTemplateAreas:
                        matches668 && !iconOnly
                            ? `
                    'avatar ${repeat("info", 100)}'
                    'avatar    button   .  ${repeat("time", 98)}'`
                            : `'avatar info info info info info button'
                              '   .    .     .     .  time  time  time'`,
                }}
                onClick={(e) => {
                    onClick(e);
                }}
            >
                <Badge
                    badgeContent=" "
                    color="primary"
                    sx={{
                        alignSelf: "center",
                        gridArea: "avatar",
                    }}
                    className="mx-6 max-[762px]:mx-2"
                    invisible={seenData}
                >
                    <Avatar
                        alt={name}
                        src={photoURL}
                        sx={{
                            width: "4rem",
                            height: "4rem",
                        }}
                    />
                </Badge>
                <div
                    className="info line-clamp-2 mb-3"
                    style={{
                        gridArea: "info",
                    }}
                >
                    <h3 className="m-0 p-0 mb-2 truncate">{name}</h3>
                    <div
                        className="text-slate-500 dark:text-slate-400"
                        dangerouslySetInnerHTML={{
                            __html: description,
                        }}
                    ></div>

                    <div className="overflow-x-auto mt-2">
                        <div className="w-max">{extraButtons}</div>
                    </div>
                </div>
                {matches668 && !iconOnly ? (
                    <Button
                        variant="outlined"
                        style={{
                            gridArea: "button",
                        }}
                        onClick={handleMarkAsRead}
                    >
                        Mark as read
                    </Button>
                ) : (
                    <IconButton
                        color="primary"
                        className="border-rounded border-2 border-solid border-[currentColor] justify-self-center items-center"
                        size="small"
                        style={{
                            gridArea: "button",
                            alignSelf: "center",
                        }}
                        onClick={handleMarkAsRead}
                    >
                        <BsCheck2All />
                    </IconButton>
                )}
                <span
                    style={{
                        gridArea: "time",
                    }}
                    className="text-gray-400 place-self-end text-[1em]"
                >
                    {dayjs(time?.toMillis() || Date.now()).fromNow()}
                </span>
            </MuiLink>
        </HoverWrapper>
    );
}
