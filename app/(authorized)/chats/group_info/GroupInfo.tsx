"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ImagePreviewModal from "../[group]/ImagePreviewModal";
import {
    AccordionDetails,
    Avatar,
    Box,
    Button,
    ButtonGroup,
    FilledInput,
    FormControl,
    IconButton,
    ImageList,
    ImageListItem,
    InputAdornment,
    InputLabel,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import HoverWrapper from "../../HoverWrapper";
import { LuCopy } from "react-icons/lu";
import SharedLink from "./SharedLink";
import { Swiper as SwiperType } from "swiper/types";
import { VoiceMessage, Accordion, AccordionSummary } from "./GroupInfoHelpers";
import { useGroup } from "@/contexts/GroupContext";
import { MemberTile } from "./MemberTile";
import { EditMemberTile } from "./EditMemberTile";
import ChangeGroupEmoji from "./ChangeGroupEmoji";

type Props = {};

export default function GroupInfo({}: Props) {
    const [activeTab, setActiveTab] = useState<0 | 1 | 2 | number>(0);
    const [swiper, setSwiper] = useState<SwiperType>();
    const [showImageModal, setShowImageModal] = useState("");
    const handleTabChange = (newValue: number) => {
        setActiveTab(newValue);
        if (swiper) {
            swiper.slideTo(newValue);
        }
    };
    const { group } = useGroup();

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
            <Box className="w-full overflow-y-auto h-full">
                <Avatar
                    src={group?.photoURL || ""}
                    alt="Some Avatar"
                    className="mx-auto mt-6 w-24 h-24"
                />
                <Typography variant="h5" align="center" className="my-2">
                    {group?.name || "Group name"}
                </Typography>
                <HoverWrapper className="mx-4 w-[calc(100%-2.1rem)]">
                    <FormControl variant="filled" fullWidth>
                        <InputLabel
                            htmlFor="filled-adornment-password"
                            className="font-bold"
                        >
                            Group Link
                        </InputLabel>
                        <FilledInput
                            value={
                                !!location
                                    ? location.origin + group?.inviteLink
                                    : group?.inviteLink
                            }
                            disabled
                            fullWidth
                            endAdornment={
                                <InputAdornment position="end">
                                    <Tooltip title="Copy">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    !!location
                                                        ? location.origin +
                                                              (group?.inviteLink ||
                                                                  "")
                                                        : group?.inviteLink ||
                                                              ""
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
                {/* all goes here */}
                add pick emoji button, customize members button, create nickname
                button, change group name input, roles for users
                <Accordion className="mt-4">
                    <AccordionSummary>Change Group Emoji</AccordionSummary>
                    <AccordionDetails>
                        <ChangeGroupEmoji />
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>See Members</AccordionSummary>
                    <AccordionDetails>
                        {group?.groupMembersBasicDetails.map((member) => (
                            <MemberTile member={member} key={member.id} />
                        ))}
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>Nicknames</AccordionSummary>
                    <AccordionDetails>
                        {group?.groupMembersBasicDetails.map((member) => (
                            <EditMemberTile member={member} key={member.id} />
                        ))}
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>
                        Manage Members (Only admins)
                    </AccordionSummary>
                    <AccordionDetails></AccordionDetails>
                </Accordion>
                <Accordion className="mb-4">
                    <AccordionSummary>Media and files</AccordionSummary>
                    <AccordionDetails>
                        <ButtonGroup
                            variant="outlined"
                            aria-label="Group's sharing"
                            fullWidth
                            className="my-3 w-full"
                        >
                            <Button
                                onClick={() => {
                                    handleTabChange(0);
                                }}
                                variant={
                                    activeTab === 0 ? "contained" : "outlined"
                                }
                            >
                                Media
                            </Button>
                            <Button
                                onClick={() => {
                                    handleTabChange(1);
                                }}
                                variant={
                                    activeTab === 1 ? "contained" : "outlined"
                                }
                            >
                                Links
                            </Button>
                            <Button
                                onClick={() => {
                                    handleTabChange(2);
                                }}
                                variant={
                                    activeTab === 2 ? "contained" : "outlined"
                                }
                            >
                                Voice
                            </Button>
                        </ButtonGroup>
                        <Swiper
                            onSwiper={(swiper) => {
                                setSwiper(swiper);
                            }}
                            onActiveIndexChange={(swiper) => {
                                setActiveTab(swiper.activeIndex);
                            }}
                        >
                            <SwiperSlide>
                                <HoverWrapper className="w-[100%-1rem]">
                                    <ImageList
                                        variant="masonry"
                                        cols={3}
                                        gap={8}
                                        className="my-0 rounded-[inherit] w-[100%-1rem]"
                                    >
                                        {imageLink.map((src, i) => (
                                            <ImageListItem
                                                key={i}
                                                component="a"
                                                href={`#${i + 1}`}
                                                onClick={() => {
                                                    setShowImageModal(
                                                        i.toString()
                                                    );
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
                                <Box>
                                    {Array(3)
                                        .fill("")
                                        .map((_, i) => {
                                            return (
                                                <SharedLink
                                                    link="https://facebook.com/"
                                                    key={i}
                                                />
                                            );
                                        })}
                                </Box>
                            </SwiperSlide>
                            <SwiperSlide>
                                {Array(2)
                                    .fill("")
                                    .map((_, i) => (
                                        <VoiceMessage key={i} />
                                    ))}
                            </SwiperSlide>
                        </Swiper>
                    </AccordionDetails>
                </Accordion>
                <Button
                    color="error"
                    variant="contained"
                    className="block max-w-[600px]"
                    fullWidth
                >
                    Leave Group
                </Button>
            </Box>
        </>
    );
}
