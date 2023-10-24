export enum DATABASE_PATH {
    users = "users",
    groupDetails = "groupDetails",
    chats = "chats",
}

export enum SITEMAP {
    forgot_password = "/forgot-password",
    chats = "/chats",
    login = "/login",
    signup = "/signup",
    verify_email = "/verify-email",
    profile = "/profile",
    general_settings = "/settings/general",
    accessibility_settings = "/settings/accessibility",
    email_settings = "/settings/email",
    password_settings = "/settings/password",
    all_messages = `/all_messages`,
    call_page = "/chats/call",
    group_info = "/chats/group_info",
    notifications = "/chats/notifications",
}

type KEY = string;

export interface IGroupDetails {
    id: KEY;
    emoji: string;
    inviteLink: string;
    groupMembers: (KEY | unknown)[];
    chatIds: (string | unknown)[];
    activeChatIndex: string;
    lastMessage: string;
    lastMessageSentBy: string;
    nickname: Partial<{
        id: string;
        nickname: string;
    }>;
}

import { MessageType } from "@/app";
import { nanoid } from "nanoid";

const id = nanoid();

export const DEFAULT_GROUP_DETAILS = Object.freeze({
    id,
    emoji: "1f44d",
    inviteLink: `https://localhost:3000/chats/${id}`,
    groupMembers: [],
    chatIds: [],
    activeChatIndex: "",
    lastMessage: "You joined this chat",
    lastMessageSentBy: "You",
    nickname: {},
} as IGroupDetails);

export interface IChatsCollection {
    controlledBy: string;
    id: string; // primary
    chats: MessageType[];
}
