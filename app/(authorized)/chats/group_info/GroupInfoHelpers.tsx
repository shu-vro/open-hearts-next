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
import React from "react";
import { PiCaretDown } from "react-icons/pi";

export const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion elevation={8} {...props} />
))((Theme) => ({}));
export const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary expandIcon={<PiCaretDown />} {...props} />
))((Theme) => ({}));
