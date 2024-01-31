"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ImagePreviewModal from "../[group]/ImagePreviewModal";
import {
    AccordionDetails,
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
    OutlinedInput,
    Tooltip,
    Typography,
} from "@mui/material";
import HoverWrapper from "../../HoverWrapper";
import { LuCopy } from "react-icons/lu";
import SharedLink from "./SharedLink";
import { Swiper as SwiperType } from "swiper/types";
import { Accordion, AccordionSummary } from "./GroupInfoHelpers";
import { MemberTile } from "./MemberTile";
import EditMemberNicknameTile from "./EditMemberNicknameTile";
import ChangeGroupEmoji from "./ChangeGroupEmoji";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import {
    changeGroupInformation,
    sendInfoMessageToGroup,
} from "@/lib/helpers/firebase-helpers";
import { auth, firestoreDb } from "@/firebase";
import { useRouter } from "next/navigation";
import { DATABASE_PATH, ROLE, SITEMAP } from "@/lib/variables";
import AddMembersAlertDialog from "./AddMembersAlertDialog";
import { IGroupDetails, MessageType } from "@/app";
import { URL_REGEX } from "@/lib/utils";
import { LoadingButton } from "@mui/lab";
import VoiceMessageBox from "../[group]/VoiceMessageBox";
import EditAndDisplayAvatar from "./EditAndDisplayAvatar";
import { useUsers } from "@/contexts/UsersInGroupContext";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";

export default function GroupInfo({
    messages = [],
    group,
}: {
    messages?: MessageType[];
    group: IGroupDetails | null;
}) {
    const [activeTab, setActiveTab] = useState<0 | 1 | 2 | number>(0);
    const [swiper, setSwiper] = useState<SwiperType>();
    const [showImageModal, setShowImageModal] = useState("");
    const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
    const [addUserDialog, setAddUserDialog] = useState(false);
    const { allUsers } = useUsers();
    const [loading, setLoading] = useState(false);
    const [groupname, setGroupname] = useState(group?.name || "");
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

    let imageLink = messages
        .map((msg) => msg.imageLink)
        .flat(Infinity) as string[];

    const handleClose = () => {
        setShowImageModal("");
    };

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

                {/* ADMIN PANEL */}
                {(group?.groupMembersBasicDetails.find(
                    (e) => e.id === auth.currentUser?.uid
                )?.role ?? ROLE.member) < ROLE.member && (
                    <Accordion>
                        <AccordionSummary>
                            Manage Group (Only admins or higher)
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                sx={{
                                    gridArea: "edit",
                                }}
                            >
                                <OutlinedInput
                                    fullWidth
                                    defaultValue={group?.name}
                                    // value={groupname}
                                    onChange={(e) => {
                                        setGroupname(e.target.value);
                                    }}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <LoadingButton
                                                size="small"
                                                variant="contained"
                                                loading={loading}
                                                sx={{
                                                    fontSize: ".70rem",
                                                }}
                                                onClick={async () => {
                                                    if (!group)
                                                        return setMessage(
                                                            "Warning: Group is not resolved"
                                                        );
                                                    if (groupname.length < 3) {
                                                        return setMessage(
                                                            "Error: cancelling operation. Name must be at least 3 characters long"
                                                        );
                                                    }
                                                    if (groupname.length > 20) {
                                                        return setMessage(
                                                            "Error: cancelling operation. Name must be less than 20 characters long"
                                                        );
                                                    }
                                                    if (
                                                        groupname === group.name
                                                    ) {
                                                        return setMessage(
                                                            "Error: group name didn't change"
                                                        );
                                                    }

                                                    changeGroupInformation(
                                                        group.id,
                                                        {
                                                            name: groupname,
                                                        }
                                                    );
                                                }}
                                            >
                                                <span>set</span>
                                            </LoadingButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                )}

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
                <Button
                    color="error"
                    variant="contained"
                    className="block max-w-[600px] mx-auto my-4"
                    sx={{ mx: "auto", display: `block` }}
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
                                    if (!auth.currentUser) return;

                                    const myInfoOnGroup =
                                        group.groupMembersBasicDetails.find(
                                            (e) =>
                                                e.id === auth.currentUser?.uid
                                        );

                                    if (!myInfoOnGroup) {
                                        return setMessage(
                                            "Error: something went wrong. please reLogin"
                                        );
                                    }
                                    await sendInfoMessageToGroup(
                                        `${myInfoOnGroup.nickname} [${myInfoOnGroup.id}] has left the group`,
                                        group.id,
                                        myInfoOnGroup
                                    );

                                    await updateDoc(
                                        doc(
                                            firestoreDb,
                                            DATABASE_PATH.groupDetails,
                                            group.id
                                        ),
                                        {
                                            groupMembers: arrayRemove(
                                                auth.currentUser?.uid
                                            ),
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
