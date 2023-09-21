"use client";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IconButton, useTheme } from "@mui/material";
import { BsCheck2All } from "react-icons/bs";
import { cn, repeat } from "@/lib/utils";

type Props = {
    name: string;
    photoURL: string;
    time: number | string;
    description: string;
    url: string;
    iconOnly?: boolean;
};

export default function Notification({
    description,
    name,
    photoURL,
    time,
    url,
    iconOnly = false,
}: Props) {
    const theme = useTheme();
    const matches668 = useMediaQuery("(min-width:668px)");
    const matches438 = useMediaQuery("(min-width:438px)");

    const handleMarkAsRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("the notification is read");
    };
    return (
        <a
            href={url}
            className={cn(
                "grid h-full mx-8 rounded-lg p-2 border-4 border-gray-400 dark:border-black border-solid first:mt-4 hover:no-underline",
                "max-[538px]:text-[10px] max-[438px]:mx-2 max-[900px]:text-sm first:mt-4"
            )}
            style={{
                color: theme.palette.text.primary,
                width: matches438 ? "calc(100% - 4rem)" : "calc(100% - 1rem)",
                background:
                    theme.palette.mode === "dark"
                        ? "linear-gradient(to bottom, #252525 50%, #444 100%)"
                        : `#dfe1eb`,

                gridTemplateAreas:
                    matches668 && !iconOnly
                        ? `
                'avatar ${repeat("info", 100)}'
                '.    button   .  ${repeat("time", 98)}'`
                        : `'avatar info info info info info button'
                        '.       .     .   .  time  time  time'`,
            }}
        >
            <Avatar
                alt="Cindy Baker"
                src={photoURL}
                className="w-12 h-12 mx-6 max-[762px]:mx-2"
                style={{
                    gridArea: "avatar",
                }}
            />
            <div
                className="info truncate"
                style={{
                    gridArea: "info",
                }}
            >
                <h3 className="m-0 p-0 mb-2 truncate">{name}</h3>
                <div className="text-slate-500 dark:text-slate-400 truncate">
                    {description}
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
                {time}
            </span>
        </a>
    );
}
