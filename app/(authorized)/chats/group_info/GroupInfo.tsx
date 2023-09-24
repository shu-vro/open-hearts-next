"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ImagePreviewModal from "../ImagePreviewModal";
import {
    Avatar,
    Box,
    FilledInput,
    FormControl,
    IconButton,
    ImageList,
    ImageListItem,
    InputAdornment,
    InputLabel,
    Tooltip,
    Typography,
} from "@mui/material";
import HoverWrapper from "../HoverWrapper";
import { LuCopy } from "react-icons/lu";
import GroupInfoTab from "./GroupInfoTab";
import SharedLink from "./SharedLink";
import { Swiper as SwiperType } from "swiper/types";
import { RiVoiceprintFill } from "react-icons/ri";
import { IoMdPause } from "react-icons/io";
import { cn, normalizeTimeFormat } from "@/lib/utils";

type Props = {};

export default function GroupInfo({}: Props) {
    const [activeTab, setActiveTab] = useState(0);
    const [swiper, setSwiper] = useState<SwiperType>();
    const [showImageModal, setShowImageModal] = useState("");
    const handleTabChange = (newValue: number) => {
        setActiveTab(newValue);
        if (swiper) {
            swiper.slideTo(newValue);
        }
    };
    const groupURL = "https://localhost:3000/chats/123456789";

    let imageLink = [
        "https://images.unsplash.com/photo-1668162692136-9c490f102de2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
        "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        "https://images.unsplash.com/photo-1682685797857-97de838c192e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        "https://plus.unsplash.com/premium_photo-1666648220960-da4b99a3a17f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
        "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
        "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        "https://plus.unsplash.com/premium_photo-1693155671457-e97a909b5fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
        "https://images.unsplash.com/photo-1668162692136-9c490f102de2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
        "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        "https://images.unsplash.com/photo-1682685797857-97de838c192e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        "https://plus.unsplash.com/premium_photo-1666648220960-da4b99a3a17f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
        "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
        "https://images.unsplash.com/photo-1692284759956-ad1330507a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        "https://plus.unsplash.com/premium_photo-1693155671457-e97a909b5fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1682685797406-97f364419b4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1693588312088-a37c2a329982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
    ];

    const handleClose = () => {
        setShowImageModal("");
    };
    return (
        <>
            <div className="w-full overflow-y-auto h-full">
                <Avatar
                    src=""
                    alt="Some Avatar"
                    className="mx-auto mt-6 w-24 h-24"
                />
                <Typography variant="h5" align="center" className="my-2">
                    Shirshen Shuvro
                </Typography>
                <HoverWrapper
                    className="mx-6"
                    style={{
                        width: `calc(100% - 3rem)`,
                    }}
                >
                    <FormControl variant="filled" fullWidth>
                        <InputLabel
                            htmlFor="filled-adornment-password"
                            className="font-bold"
                        >
                            Group Link
                        </InputLabel>
                        <FilledInput
                            value={groupURL}
                            disabled
                            endAdornment={
                                <InputAdornment position="end">
                                    <Tooltip title="Copy">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    groupURL
                                                );
                                            }}
                                            edge="end"
                                        >
                                            <LuCopy />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </HoverWrapper>
                <Box className="flex justify-between items-center my-1.5 mx-4 w-[calc(100%-2rem)] flex-row">
                    <GroupInfoTab
                        onClick={() => {
                            handleTabChange(0);
                        }}
                        selected={activeTab === 0}
                    >
                        Media
                    </GroupInfoTab>
                    <GroupInfoTab
                        onClick={() => {
                            handleTabChange(1);
                        }}
                        selected={activeTab === 1}
                    >
                        Links
                    </GroupInfoTab>
                    <GroupInfoTab
                        onClick={() => {
                            handleTabChange(2);
                        }}
                        selected={activeTab === 2}
                    >
                        Voice
                    </GroupInfoTab>
                </Box>
                <Swiper
                    onSwiper={(swiper) => {
                        setSwiper(swiper);
                    }}
                    onActiveIndexChange={(swiper) => {
                        setActiveTab(swiper.activeIndex);
                    }}
                >
                    <SwiperSlide>
                        <HoverWrapper className=" w-[calc(100%-2rem)] mx-auto">
                            <ImageList
                                variant="masonry"
                                cols={3}
                                gap={8}
                                className="my-0 rounded-[inherit]"
                            >
                                {imageLink.map((src, i) => (
                                    <ImageListItem
                                        key={i}
                                        component="a"
                                        href={`#${i + 1}`}
                                        onClick={() => {
                                            setShowImageModal(i.toString());
                                        }}
                                    >
                                        <img
                                            src={`${src}?w=248&fit=crop&auto=format`}
                                            srcSet={`${src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                            alt={src}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                                <ImagePreviewModal
                                    images={imageLink}
                                    handleClose={handleClose}
                                    showImageModal={showImageModal}
                                />
                            </ImageList>
                        </HoverWrapper>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            {Array(3)
                                .fill("")
                                .map((_, i) => {
                                    return (
                                        <SharedLink
                                            link="https://mui.com/"
                                            key={i}
                                        />
                                    );
                                })}
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        {Array(2)
                            .fill("")
                            .map((_, i) => (
                                <VoiceMessage key={i} />
                            ))}
                    </SwiperSlide>
                </Swiper>
            </div>
        </>
    );
}

function VoiceMessage({}) {
    const [voiceMessageDone, setVoiceMessageDone] = useState(0);
    return (
        <HoverWrapper className="my-1.5 mx-auto w-[calc(100%-2rem)]  max-w-sm">
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
                <div
                    className="relative text-3xl max-[865px]:text-2xl overflow-hidden"
                    onClick={(e) => {
                        let rect = e.currentTarget.getBoundingClientRect();
                        setVoiceMessageDone(
                            ((e.clientX - rect.x) / rect.width) * 100
                        );
                    }}
                >
                    <div className="base opacity-40 flex justify-center items-center flex-row">
                        {Array(6)
                            .fill("")
                            .map((_, i) => (
                                <RiVoiceprintFill key={i} />
                            ))}
                    </div>
                    <div
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
                    </div>
                </div>
                <span className="end font-bold">
                    {normalizeTimeFormat(400)}
                </span>
            </Box>
        </HoverWrapper>
    );
}
