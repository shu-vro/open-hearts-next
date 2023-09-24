"use client";

import { useTheme } from "@mui/material";
import React from "react";
import CanvasDark from "./CanvasDark";
import CanvasLight from "./CanvasLight";

export default function Canvas3D() {
    const {
        palette: { mode },
    } = useTheme();

    return <>{mode === "dark" ? <CanvasDark /> : <CanvasLight />}</>;
}
