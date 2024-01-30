"use client";

import { DefaultUserConfig, cn } from "@/lib/utils";
import Avatar from "@mui/material/Avatar";
import React, { useEffect, useState } from "react";
import { AiOutlineMessage, AiOutlinePlus } from "react-icons/ai";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Popover,
    useTheme,
} from "@mui/material";
import EmojiPicker, {
    EmojiStyle,
    Theme,
    EmojiClickData,
} from "emoji-picker-react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useMessage } from "@/contexts/MessageContext";
import {
    IGroupDetails,
    MessageType,
    TGroupMembersBasicDetails,
    TypesOfMessage,
    UserType,
} from "@/app";
import HoverWrapper, { HoverWrapperProps } from "../../HoverWrapper";
import GetEmojiLink from "./GetEmojiLink";
import DeletedMessageBox from "./DeletedMessageBox";
import { MessageBox } from "./MessageBox";
import { useGroup } from "@/contexts/GroupContext";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestoreDb } from "@/firebase";
import { DATABASE_PATH, SITEMAP } from "@/lib/variables";
import dayjs from "dayjs";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import MuiLink from "@/app/MuiLink";
import DeleteOrReportChip from "./DeleteOrReportChip";
import { useUsers } from "@/contexts/UsersInGroupContext";

export type Props = {
    by: "me" | "him";
    type?: TypesOfMessage | null;
    msg: MessageType;
};

export function NativeHoverWrapper({
    children,
    classNameInner,
    style,
    replied = false,
}: { replied?: boolean } & HoverWrapperProps) {
    return (
        <HoverWrapper
            className={cn("my-2 z-2", replied && "mt-0")}
            classNameInner={cn(classNameInner)}
            style={{
                gridArea: "message",
                ...style,
            }}
        >
            {children}
        </HoverWrapper>
    );
}

function PickEmoji({
    msg,
    group,
    anchorElForEmojiPopover,
    setAnchorElForEmojiPopover,
    setToastMessage,
}: {
    msg: MessageType;
    anchorElForEmojiPopover: HTMLElement | null;
    setAnchorElForEmojiPopover: React.Dispatch<
        React.SetStateAction<HTMLElement | null>
    >;
    setToastMessage: React.Dispatch<React.SetStateAction<string>>;
    group: IGroupDetails | null;
}) {
    const {
        palette: { mode: themeMode },
    } = useTheme();
    return (
        <Popover
            open={Boolean(anchorElForEmojiPopover)}
            anchorEl={anchorElForEmojiPopover}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            onClose={() => setAnchorElForEmojiPopover(null)}
        >
            <EmojiPicker
                onEmojiClick={async (
                    emojiData: EmojiClickData,
                    _: MouseEvent
                ) => {
                    if (!group) return setToastMessage("Group is not resolved");
                    if (!auth.currentUser)
                        return setToastMessage("User is not resolved");
                    setAnchorElForEmojiPopover(null);
                    const emoji = emojiData.unified.replace("___", "");
                    let newMsg = { ...msg };
                    newMsg.reactions[auth.currentUser.uid] = emoji;

                    await setDoc(
                        doc(
                            firestoreDb,
                            DATABASE_PATH.groupDetails,
                            group.id,
                            DATABASE_PATH.messages,
                            newMsg.id
                        ),
                        newMsg,
                        {
                            merge: true,
                        }
                    );
                }}
                autoFocusSearch={false}
                theme={themeMode as Theme}
                searchPlaceHolder="Search Emoji"
                emojiStyle={EmojiStyle.FACEBOOK}
                lazyLoadEmojis={true}
                customEmojis={[
                    {
                        names: ["heart", "heavy black heart"],
                        imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-facebook/img/facebook/64/2764-fe0f.png",
                        id: "___2764-fe0f",
                    },
                    {
                        names: ["like", "+1", "thumbsUp", "thumbs up sign"],
                        imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-facebook/img/facebook/64/1f44d.png",
                        id: "___1f44d",
                    },
                    {
                        names: [
                            "dislike",
                            "-1",
                            "thumbsDown",
                            "thumbs down sign",
                        ],
                        imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-facebook/img/facebook/64/1f44e.png",
                        id: "___1f44e",
                    },
                    {
                        names: ["angry", "angry face"],
                        imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-facebook/img/facebook/64/1f620.png",
                        id: "___1f620",
                    },
                    {
                        names: ["HaHa", "rolling on the floor laughing"],
                        imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-facebook/img/facebook/64/1f923.png",
                        id: "___1f923",
                    },
                ]}
            />
        </Popover>
    );
}

function ReactorTile({
    emoji,
    reactor_id,
    reactor_info,
}: {
    emoji: string;
    reactor_id: string;
    reactor_info: TGroupMembersBasicDetails | undefined;
}) {
    return (
        <HoverWrapper className="w-[calc(100%-2px)] mt-2">
            <Box className="flex justify-between items-center flex-row px-3 py-4 text-xl capitalize">
                <MuiLink
                    href={`${SITEMAP.profile}/${reactor_id}`}
                    sx={{
                        color: "text.primary",
                    }}
                >
                    {reactor_info?.nickname || "Removed user"}
                </MuiLink>
                <GetEmojiLink unified={emoji} size={35} />
            </Box>
        </HoverWrapper>
    );
}

let clickCount = 0;

export default function Message({ by, type = "text", msg }: Props) {
    const { group } = useGroup();
    const [anchorElForEmojiPopover, setAnchorElForEmojiPopover] =
        useState<null | HTMLElement>(null);
    const [user, setUser] = useState<UserType>(DefaultUserConfig);
    const { getUserById, allUsers } = useUsers();
    const { setMessage } = useMessage();
    const { setMessage: setToastMessage } = useToastAlert();
    const [showReactors, setShowReactors] = useState(false);

    useEffect(() => {
        setUser(getUserById(msg.sender_id));
    }, [allUsers]);

    const handleShowReactorsClose = () => {
        setShowReactors(false);
    };

    return type === "info" ? (
        <div className="text-center w-full text-xs opacity-70">
            <div>{dayjs(msg.created_at.toMillis()).fromNow()}</div>
            {msg.info}
        </div>
    ) : (
        <div
            className={cn(
                "grid max-w-[80%] pl-4 my-4",
                by === "me" ? "ml-auto mr-3" : ""
            )}
            style={{
                gridTemplateAreas:
                    by === "him"
                        ? `
                        'name    name       time'
                        'message message message'
                        'likes   likes      reply'
                        `
                        : `
                        'time    name       name'
                        'message message message'
                        'reply   likes      likes'
                        `,
            }}
        >
            <div
                className={cn(
                    "name flex justify-start items-center flex-row gap-2",
                    by === "me" ? "justify-self-end" : ""
                )}
                style={{ gridArea: "name" }}
            >
                <Avatar
                    src={user?.photoURL || ""}
                    alt="shirshen shuvro"
                    component={by === "him" ? Link : "div"}
                    href={SITEMAP.profile + "/" + msg.sender_id}
                    sx={{ width: 30, height: 30 }}
                />
                {by === "him" && (
                    <span>
                        {
                            group?.groupMembersBasicDetails?.filter(
                                (e) => e.id === msg.sender_id
                            )[0].nickname
                        }
                    </span>
                )}
            </div>
            <div
                className={cn(
                    "time justify-self-end text-xs text-gray-500",
                    by === "me" && "justify-self-start"
                )}
                style={{ gridArea: "time" }}
            >
                {dayjs(msg.created_at?.seconds * 1000 || Date.now()).format(
                    "ddd, MMM D, YYYY h:mm:ss A"
                )}
            </div>
            {msg.deleted ? (
                <DeletedMessageBox by={by} reply={msg.reply} />
            ) : (
                <MessageBox by={by} type={type} msg={msg} />
            )}
            <div
                className={cn(
                    "likes flex justify-start items-center flex-row gap-2",
                    by === "me" ? "justify-self-end" : "justify-self-start"
                )}
                style={{ gridArea: "likes" }}
            >
                {!!Object.keys(msg.reactions).length && (
                    <Chip
                        icon={
                            <div
                                style={{
                                    marginLeft: "4px",
                                    marginRight: "-6px",
                                }}
                            >
                                {Array.from(
                                    new Set(Object.values(msg.reactions))
                                ).map((emojiData) => {
                                    return (
                                        <GetEmojiLink
                                            key={emojiData}
                                            unified={emojiData}
                                            size={15}
                                        />
                                    );
                                })}
                            </div>
                        }
                        label={Object.keys(msg.reactions).length}
                        color="primary"
                        variant="filled"
                        clickable
                        onClick={function () {
                            clickCount++;

                            setTimeout(function () {
                                if (clickCount === 1) {
                                    setShowReactors(true);
                                }
                                clickCount = 0;
                            }, 500);
                        }}
                        onDoubleClick={async function () {
                            if (!group)
                                return setToastMessage("Group is not resolved");
                            if (!auth.currentUser)
                                return setToastMessage("User is not resolved");
                            const emoji = "2764-fe0f";
                            let newMsg = { ...msg };
                            if (auth.currentUser.uid in newMsg.reactions) {
                                delete newMsg.reactions[auth.currentUser.uid];
                            } else {
                                newMsg.reactions[auth.currentUser.uid] = emoji;
                            }

                            await setDoc(
                                doc(
                                    firestoreDb,
                                    DATABASE_PATH.groupDetails,
                                    group.id,
                                    DATABASE_PATH.messages,
                                    msg.id
                                ),
                                newMsg,
                                {
                                    merge: true,
                                }
                            );
                            clickCount = 0; // Reset the click count on double-click
                        }}
                    />
                )}

                <IconButton
                    onClick={(e) => {
                        setAnchorElForEmojiPopover(e.currentTarget);
                    }}
                    size="small"
                    color="primary"
                    sx={{
                        border: "1px solid currentcolor",
                    }}
                >
                    <AiOutlinePlus />
                </IconButton>
                <Dialog
                    open={showReactors}
                    onClose={handleShowReactorsClose}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Reactions</DialogTitle>
                    <DialogContent>
                        {Object.entries(msg.reactions).map((emojiData) => (
                            <ReactorTile
                                key={emojiData[0]}
                                emoji={emojiData[1]}
                                reactor_id={emojiData[0]}
                                reactor_info={group?.groupMembersBasicDetails.find(
                                    ({ id }) => id === emojiData[0]
                                )}
                            />
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleShowReactorsClose}
                            variant="contained"
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div
                className={cn(
                    "reply flex justify-center items-center flex-row",
                    by === "him" ? "justify-self-end" : "justify-self-start"
                )}
                style={{ gridArea: "reply" }}
            >
                <HoverWrapper className="rounded-full">
                    <Chip
                        icon={<AiOutlineMessage />}
                        label="Reply"
                        onClick={() => {
                            setMessage((prev) => {
                                return {
                                    ...prev,
                                    reply: msg.id,
                                };
                            });
                        }}
                    />
                </HoverWrapper>
                <DeleteOrReportChip msg={msg} by={by} />
            </div>

            <PickEmoji
                msg={msg}
                group={group}
                anchorElForEmojiPopover={anchorElForEmojiPopover}
                setAnchorElForEmojiPopover={setAnchorElForEmojiPopover}
                setToastMessage={setToastMessage}
            ></PickEmoji>
        </div>
    );
}
