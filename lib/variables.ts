import { IGroupDetails } from "@/app";
import { type Timestamp, serverTimestamp } from "firebase/firestore";
import { nanoid } from "nanoid";

export enum DATABASE_PATH {
    users = "users",
    groupDetails = "groupDetails",
    messages = "messages",
    notifications = "notifications",
    reports = "reports",
}

export const enum SITEMAP {
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
    call_page = "/chats/call",
    group_info = "/chats/group_info",
    notifications = "/notifications",
    group = "/chats/[group]",
    pinned = "/chats/[group]?pinned=1",
}

export const enum STATUS {
    active = "active",
    away = "away",
    inactive = "inactive",
}

export const enum ROLE {
    owner,
    admin,
    member,
}

const id = nanoid();

export const DEFAULT_GROUP_DETAILS = Object.freeze({
    id,
    name: "",
    emoji: "1f44d",
    inviteLink: `/chats/${id}`,
    groupMembers: [],
    groupMembersBasicDetails: [],
    photoURL: "",
    lastMessage: {
        message: "You joined this chat",
        by: "You",
        sentTime: serverTimestamp() as Timestamp,
        seenBy: [],
    },
} as IGroupDetails);
