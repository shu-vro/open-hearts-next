import React, { useEffect, useRef, useState } from "react";
import { IoMdPause } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { cn, normalizeTimeFormat } from "@/lib/utils";
// @ts-ignore
import { AudioVisualizer } from "react-audio-visualize";
import { Box, IconButton } from "@mui/material";
import ReplyBox from "./ReplyBox";
import { NativeHoverWrapper } from "./Message";

type Props = {
    msg: {
        voice: string;
        reply: string;
        id: string;
    };
    by: "me" | "him";
};

export default function VoiceMessageBox({ msg, by }: Props) {
    const [currentTime, setCurrentTime] = useState(0);
    const [voiceBlob, setVoiceBlob] = useState<Blob>();
    const [src, setSrc] = useState("///");
    const [firstTimePlayingVoice, setFirstTimePlayingVoice] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const visualizerRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (visualizerRef.current) {
            visualizerRef.current.style.width = "100%";
        }
        // audioRef.current?.style.width = '100%';
        const clickEvent = (e: MouseEvent) => {
            if (!audioRef.current || !visualizerRef.current) return;
            let { width } = visualizerRef.current.getBoundingClientRect();
            const goToTimeStamp =
                audioRef.current.duration * (e.offsetX / width);
            audioRef.current.currentTime = goToTimeStamp;
        };

        visualizerRef.current?.addEventListener("click", clickEvent);
        return () => {
            visualizerRef.current?.removeEventListener("click", clickEvent);
        };
    }, []);

    useEffect(() => {
        if (firstTimePlayingVoice) {
            setSrc(msg.voice);
        }
    }, [firstTimePlayingVoice]);

    return (
        <Box
            className={cn(by === "me" ? "justify-self-end" : "")}
            sx={{
                gridArea: "message",
            }}
            id={msg.id}
        >
            <ReplyBox by={by} replyId={msg.reply} />
            <NativeHoverWrapper replied={!!msg.reply}>
                <Box
                    className={cn(
                        "message text-sm p-3 rounded-[inherit] flex justify-center items-center flex-row gap-2",
                        by === "me" && "float-right"
                    )}
                    bgcolor="mySwatch.messageBG"
                    sx={{
                        bgcolor: (theme) =>
                            by === "him"
                                ? theme.palette.mySwatch.messageBG
                                : theme.palette.primary.main,
                        color: (theme) =>
                            by === "me"
                                ? theme.palette.getContrastText(
                                      theme.palette.primary.main
                                  )
                                : "inherit",
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={() => {
                            if (!audioRef.current) return;
                            setFirstTimePlayingVoice(true);
                            if (audioRef.current.paused) {
                                audioRef.current.play();
                            } else {
                                audioRef.current.pause();
                            }
                        }}
                        sx={{
                            color: (theme) =>
                                by === "me"
                                    ? theme.palette.getContrastText(
                                          theme.palette.primary.main
                                      )
                                    : "inherit",
                        }}
                    >
                        {!firstTimePlayingVoice ? (
                            <MdOutlineFileDownload />
                        ) : audioRef.current?.paused ? (
                            <FaPlay />
                        ) : (
                            <IoMdPause />
                        )}
                    </IconButton>
                    <span className="start font-bold">
                        {normalizeTimeFormat(currentTime ?? 0)}
                    </span>
                    <audio
                        hidden
                        ref={audioRef}
                        controls
                        src={src}
                        onLoadedMetadata={async () => {
                            try {
                                const res = await fetch(src);
                                const blob = await res.blob();
                                setVoiceBlob(blob);
                            } catch (error) {
                                console.warn(error);
                            }
                        }}
                        onTimeUpdate={(e) => {
                            const aud = e.target as HTMLAudioElement;
                            setCurrentTime(aud.currentTime);
                        }}
                    />
                    <Box className="overflow-x-auto grow w-full">
                        <AudioVisualizer
                            blob={voiceBlob}
                            width={400}
                            height={50}
                            barWidth={3}
                            gap={2}
                            barColor={"currentColor"}
                            barPlayedColor="white"
                            currentTime={currentTime}
                            ref={visualizerRef}
                            fftSize={512}
                        />
                    </Box>
                    <span className="end font-bold">
                        {normalizeTimeFormat(audioRef.current?.duration ?? 0)}
                    </span>
                </Box>
            </NativeHoverWrapper>
        </Box>
    );
}
