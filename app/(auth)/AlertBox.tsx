"use client";

import * as React from "react";
import Alert, { type AlertProps } from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import { VscClose } from "react-icons/vsc";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { computeSeverityMessage } from "@/lib/utils";

type Props = {
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    message: string;
} & Partial<AlertProps>;

export default function AlertBox({ message, setMessage, ...props }: Props) {
    const [progress, setProgress] = React.useState(100);

    React.useEffect(() => {
        // !message -> no error, empty string, don't show.
        if (!!message) {
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress <= 0) {
                        setMessage("");
                        setProgress(100);
                        clearInterval(timer);
                    }
                    const diff = 5;
                    return Math.max(oldProgress - diff, 0);
                });
            }, 200);

            return () => {
                clearInterval(timer);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);

    return (
        <Box
            sx={{
                w: "100%",
            }}
        >
            {!!message && (
                <LinearProgress variant="determinate" value={progress} />
            )}
            <Collapse
                in={!!message}
                onExit={() => {
                    setProgress(100);
                }}
            >
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setMessage("");
                                setProgress(0);
                            }}
                        >
                            <VscClose />
                        </IconButton>
                    }
                    sx={{ mb: 2, whiteSpace: "pre" }}
                    severity={computeSeverityMessage(message)}
                    variant="filled"
                    {...props}
                >
                    {message}
                </Alert>
            </Collapse>
        </Box>
    );
}
