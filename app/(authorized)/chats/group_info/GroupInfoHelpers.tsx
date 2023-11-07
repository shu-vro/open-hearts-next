import { cn, normalizeTimeFormat } from "@/lib/utils";
import {
    AccordionProps,
    AccordionSummaryProps,
    Box,
    IconButton,
    Accordion as MuiAccordion,
    AccordionSummary as MuiAccordionSummary,
    styled,
} from "@mui/material";
import React, { useState } from "react";
import { IoMdPause } from "react-icons/io";
import { RiVoiceprintFill } from "react-icons/ri";
import HoverWrapper from "../../HoverWrapper";
import { PiCaretDown } from "react-icons/pi";

export function VoiceMessage({}) {
    const [voiceMessageDone, setVoiceMessageDone] = useState(0);
    return (
        <HoverWrapper className="my-1.5 mx-auto w-full  max-w-sm">
            <Box
                className={cn(
                    "message text-sm p-3 rounded-lg flex justify-between items-center flex-row gap-2"
                )}
            >
                <IconButton size="small">
                    <IoMdPause />
                </IconButton>
                <span className="start font-bold">
                    {normalizeTimeFormat(0)}
                </span>
                <Box
                    className="relative text-3xl max-[865px]:text-2xl overflow-hidden"
                    onClick={(e) => {
                        let rect = e.currentTarget.getBoundingClientRect();
                        setVoiceMessageDone(
                            ((e.clientX - rect.x) / rect.width) * 100
                        );
                    }}
                >
                    <Box className="base opacity-40 flex justify-center items-center flex-row">
                        {Array(6)
                            .fill("")
                            .map((_, i) => (
                                <RiVoiceprintFill key={i} />
                            ))}
                    </Box>
                    <Box
                        className="slider absolute top-0 left-0 w-full h-full"
                        style={{
                            clipPath: `polygon(0 0, ${voiceMessageDone}% 0, ${voiceMessageDone}% 100%, 0% 100%)`,
                        }}
                    >
                        {Array(6)
                            .fill("")
                            .map((_, i) => (
                                <RiVoiceprintFill key={i} />
                            ))}
                    </Box>
                </Box>
                <span className="end font-bold">
                    {normalizeTimeFormat(400)}
                </span>
            </Box>
        </HoverWrapper>
    );
}

export const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion elevation={8} {...props} />
))((Theme) => ({}));
export const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary expandIcon={<PiCaretDown />} {...props} />
))((Theme) => ({}));
