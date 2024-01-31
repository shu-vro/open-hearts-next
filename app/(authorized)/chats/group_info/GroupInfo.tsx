"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    AccordionDetails,
    Box,
    Button,
    ButtonGroup,
    Typography,
} from "@mui/material";
import HoverWrapper from "../../HoverWrapper";
import SharedLink from "./SharedLink";
import { Swiper as SwiperType } from "swiper/types";
import { Accordion, AccordionSummary } from "./GroupInfoHelpers";
import { MemberTile } from "./MemberTile";
import EditMemberNicknameTile from "./EditMemberNicknameTile";
import ChangeGroupEmoji from "./ChangeGroupEmoji";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { ROLE } from "@/lib/variables";
import AddMembersAlertDialog from "./AddMembersAlertDialog";
import { IGroupDetails, MessageType } from "@/app";
import { URL_REGEX } from "@/lib/utils";
import VoiceMessageBox from "../[group]/VoiceMessageBox";
import EditAndDisplayAvatar from "./EditAndDisplayAvatar";
import { useUsers } from "@/contexts/UsersInGroupContext";
import GroupLink from "./GroupLink";
import GroupAdminAccordion from "./GroupAdminAccordion";
import ImageSwiperSlide from "./ImageSwiperSlide";
import LeaveGroup from "./LeaveGroup";

export default function GroupInfo({
    messages = [],
    group,
}: {
    messages?: MessageType[];
    group: IGroupDetails | null;
}) {
    const [activeTab, setActiveTab] = useState<0 | 1 | 2 | number>(0);
    const [swiper, setSwiper] = useState<SwiperType>();
    const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
    const [addUserDialog, setAddUserDialog] = useState(false);
    const { allUsers } = useUsers();
    const [loading, setLoading] = useState(false);
    const [myRole, setMyRole] = useState<number | undefined>();
    const handleTabChange = (newValue: number) => {
        setActiveTab(newValue);
        if (swiper) {
            swiper.slideTo(newValue);
        }
    };
    const handleCloseLeaveDialog = () => {
        setOpenLeaveDialog(false);
    };
    const { setMessage } = useToastAlert();
    const { push } = useRouter();

    useEffect(() => {
        if (!group) return;
        setMyRole(
            group?.groupMembersBasicDetails.find(
                (e) => e.id === auth.currentUser?.uid
            )?.role
        );
    }, [allUsers]);

    return (
        <>
            <Box className="w-full overflow-y-auto h-full">
                <EditAndDisplayAvatar />
                <Typography
                    variant="h4"
                    align="center"
                    className="my-2 capitalize"
                >
                    {group?.name || "Group name"}
                </Typography>
                <GroupLink inviteLink={group?.inviteLink || ""} />
                <Accordion className="mt-4">
                    <AccordionSummary>Change Group Emoji</AccordionSummary>
                    <AccordionDetails>
                        <ChangeGroupEmoji />
                    </AccordionDetails>
                </Accordion>
                {/* ADMIN PANEL */}
                {(group?.groupMembersBasicDetails.find(
                    (e) => e.id === auth.currentUser?.uid
                )?.role ?? ROLE.member) < ROLE.member && (
                    <Accordion elevation={3}>
                        <AccordionSummary>✨ Manage Group ✨</AccordionSummary>
                        <GroupAdminAccordion loading={loading} />
                    </Accordion>
                )}
                <Accordion>
                    <AccordionSummary>See Members</AccordionSummary>
                    <AccordionDetails>
                        <HoverWrapper className="mb-2 mx-1 w-[calc(100%-1rem)]">
                            <Box
                                className="grid p-2 py-7 text-inherit hover:no-underline place-items-center cursor-pointer"
                                onClick={() => {
                                    setAddUserDialog(true);
                                }}
                            >
                                <span>Add member</span>
                            </Box>
                            <AddMembersAlertDialog
                                open={addUserDialog}
                                setOpen={setAddUserDialog}
                            />
                        </HoverWrapper>
                        {group?.groupMembersBasicDetails.map((member) => (
                            <MemberTile
                                member={
                                    group.groupMembers.indexOf(member.id) > -1
                                        ? member
                                        : null
                                }
                                key={member.id}
                                user={allUsers.find((e) => e.uid === member.id)}
                                myRole={myRole}
                                addedBy={group?.groupMembersBasicDetails.find(
                                    (e) => e.id === member.addedBy
                                )}
                            />
                        ))}
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>Nicknames</AccordionSummary>
                    <AccordionDetails>
                        {group?.groupMembersBasicDetails.map((member) => (
                            <EditMemberNicknameTile
                                member={
                                    group?.groupMembers.includes(member.id)
                                        ? member
                                        : null
                                }
                                user={allUsers.find((e) => e.uid === member.id)}
                                key={member.id}
                            />
                        ))}
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>Pinned Message</AccordionSummary>
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
                                <ImageSwiperSlide />
                            </SwiperSlide>
                            <SwiperSlide>
                                <Box>
                                    {messages.map((msg) => {
                                        if (!msg.text) return null;
                                        return msg.text
                                            .match(URL_REGEX)
                                            ?.map((text_message, j) => {
                                                return (
                                                    <SharedLink
                                                        link={text_message}
                                                        messageTime={
                                                            msg.created_at
                                                        }
                                                        sender={allUsers.find(
                                                            (user) =>
                                                                user.uid ===
                                                                msg.sender_id
                                                        )}
                                                        key={j}
                                                    />
                                                );
                                            });
                                    })}
                                </Box>
                            </SwiperSlide>
                            <SwiperSlide>
                                <Box>
                                    {messages.map((msg) => {
                                        if (!msg.voice) return null;
                                        return (
                                            <VoiceMessageBox
                                                key={msg.id}
                                                by="him"
                                                msg={{
                                                    id: msg.id,
                                                    reply: "",
                                                    voice: msg.voice,
                                                }}
                                            />
                                        );
                                    })}
                                </Box>
                            </SwiperSlide>
                        </Swiper>
                    </AccordionDetails>
                </Accordion>
                <LeaveGroup />
            </Box>
        </>
    );
}
