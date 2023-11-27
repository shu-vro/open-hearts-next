"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ImagePreviewModal from "../[group]/ImagePreviewModal";
import {
    AccordionDetails,
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
import HoverWrapper from "../../HoverWrapper";
import { LuCopy } from "react-icons/lu";
import SharedLink from "./SharedLink";
import { Swiper as SwiperType } from "swiper/types";
import { VoiceMessage, Accordion, AccordionSummary } from "./GroupInfoHelpers";
import { useGroup } from "@/contexts/GroupContext";
import { MemberTile } from "./MemberTile";
import { EditMemberTile } from "./EditMemberTile";
import ChangeGroupEmoji from "./ChangeGroupEmoji";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { changeGroupInformation } from "@/lib/helpers/firebase-helpers";
import { auth, firestoreDb } from "@/firebase";
import { useRouter } from "next/navigation";
import { DATABASE_PATH, SITEMAP } from "@/lib/variables";
import AddMembersAlertDialog from "./AddMembersAlertDialog";
import { collection, getDocs, query } from "firebase/firestore";
import { MessageType, UserType } from "@/app";
import { URL_REGEX } from "@/lib/utils";
import { LoadingButton } from "@mui/lab";

export default function GroupInfo({
    messages = [],
}: {
    messages?: MessageType[];
}) {
    const [activeTab, setActiveTab] = useState<0 | 1 | 2 | number>(0);
    const [swiper, setSwiper] = useState<SwiperType>();
    const [showImageModal, setShowImageModal] = useState("");
    const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
    const [addUserDialog, setAddUserDialog] = useState(false);
    const [allUsers, setAllUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);
    const handleTabChange = (newValue: number) => {
        setActiveTab(newValue);
        if (swiper) {
            swiper.slideTo(newValue);
        }
    };
    const { group } = useGroup();
    const handleCloseLeaveDialog = () => {
        setOpenLeaveDialog(false);
    };
    const { setMessage } = useToastAlert();
    const { push } = useRouter();

    useEffect(() => {
        (async () => {
            if (!group) return;
            if (!auth.currentUser?.uid)
                return setMessage(
                    "User might be logged out. If this error continues, login again"
                );
            const q = query(collection(firestoreDb, DATABASE_PATH.users));
            let allDocs = await getDocs(q);
            if (!allDocs.empty) {
                setAllUsers(
                    allDocs.docs
                        .map((doc) => doc.data() as UserType)
                        .sort((a, b) => -b.name[0].localeCompare(a.name[0]))
                    // .filter((el) => !group.groupMembers?.includes(el.uid))
                );
            }
        })();
    }, [group?.groupMembers]);

    let imageLink = messages
        .map((msg) => msg.imageLink)
        .flat(Infinity) as string[];

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
                <Accordion className="mt-4">
                    <AccordionSummary>Change Group Emoji</AccordionSummary>
                    <AccordionDetails>
                        <ChangeGroupEmoji />
                    </AccordionDetails>
                </Accordion>
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
                                allUsers={allUsers}
                                setOpen={setAddUserDialog}
                            />
                        </HoverWrapper>
                        {group?.groupMembersBasicDetails.map((member) => (
                            <MemberTile
                                member={member}
                                key={member.id}
                                user={allUsers.find((e) => e.uid === member.id)}
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
                            <EditMemberTile
                                member={member}
                                user={allUsers.find((e) => e.uid === member.id)}
                                key={member.id}
                            />
                        ))}
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>
                        Manage Group (Only admins)
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
                                        {imageLink.map((src, i) => {
                                            return (
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
                                            );
                                        })}
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
                                                        key={j}
                                                    />
                                                );
                                            });
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
                    onClick={() => {
                        setOpenLeaveDialog(true);
                    }}
                >
                    Leave Group
                </Button>
                <Dialog
                    open={openLeaveDialog}
                    onClose={handleCloseLeaveDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle>Leave Group?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure to leave{" "}
                            <Typography color="primary.main" component={"span"}>
                                {group?.name || "<group-name>"}
                            </Typography>{" "}
                            group?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <LoadingButton
                            loading={loading}
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    if (!group) return;
                                    let groupMembers =
                                        group.groupMembers.filter(
                                            (member) =>
                                                member !== auth.currentUser?.uid
                                        );
                                    let groupMembersBasicDetails =
                                        group.groupMembersBasicDetails.filter(
                                            (member) =>
                                                member.id !==
                                                auth.currentUser?.uid
                                        );
                                    await changeGroupInformation(
                                        group?.id || "",
                                        {
                                            groupMembers,
                                            groupMembersBasicDetails,
                                        }
                                    );
                                    setMessage("You left from group.");
                                    push(SITEMAP.chats);
                                } catch (e) {
                                    setMessage("Error: check console");
                                    console.log(e);
                                }
                                setLoading(false);
                                handleCloseLeaveDialog();
                            }}
                            variant="contained"
                            color="error"
                        >
                            <span>Yes</span>
                        </LoadingButton>
                        <Button onClick={handleCloseLeaveDialog} autoFocus>
                            No
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}
