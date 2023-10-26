export enum DATABASE_PATH {
    users = "users",
    groupDetails = "groupDetails",
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
    name: string;
    emoji: string;
    inviteLink: string;
    groupMembers: (KEY | unknown)[];
    lastMessage: string;
    lastMessageSentBy: string;
    lastMessageSentTime: number;
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
    name: "",
    emoji: "1f44d",
    inviteLink: `/chats/${id}`,
    groupMembers: [],
    lastMessage: "You joined this chat",
    lastMessageSentBy: "You",
    nickname: {},
    lastMessageSentTime: Date.now(),
} as IGroupDetails);
