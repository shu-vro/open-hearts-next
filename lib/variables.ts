import { IGroupDetails } from "@/app";
import { nanoid } from "nanoid";

export enum DATABASE_PATH {
    users = "users",
    groupDetails = "groupDetails",
    messages = "messages",
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
    call_page = "/chats/call",
    group_info = "/chats/group_info",
    notifications = "/notifications",
}

const id = nanoid();

export const DEFAULT_GROUP_DETAILS = Object.freeze({
    id,
    name: "",
    emoji: "1f44d",
    inviteLink: `/chats/${id}`,
    groupMembers: [],
    groupMembersBasicDetails: [],
    photoURL:
        "https://img.fixthephoto.com/blog/images/gallery/news_preview_mob_image__preview_404.jpg",
    lastMessage: {
        message: "You joined this chat",
        by: "You",
        sentTime: Date.now(),
        seenBy: [],
    },
} as IGroupDetails);
