/// <reference types="original-module" />

import "@mui/material/styles";
import { ROLE, STATUS } from "@/lib/variables";
import { FieldValue, serverTimestamp, Timestamp } from "firebase/firestore";

declare module "@mui/material/styles" {
    interface Palette {
        mySwatch: {
            messageBG: string;
        };
    }
    interface PaletteOptions {
        mySwatch: {
            messageBG: string;
        }; // or any other type that suits your needs
    }
}

declare interface ReportDocument {
    path: string;
    reported_by: UserType["uid"];
    reported_to: MessageType["sender_id"];
    group: string;
    report_created_at: Timestamp;
}

declare type MessageType = {
    id: string;
    text: string;
    emoji: string;
    deleted: boolean;
    imageLink: string[];
    voice: string;
    reply: string | null;
    reactions: {
        [x: string]: string;
    };
    created_at: Timestamp;
    sender_id: string;
    info: string;
    reportCount: number;
    pinned: boolean;
};

export type TypesOfMessage = "text" | "image" | "emoji" | "voice" | "info";

export interface UserType {
    name: string;
    email: string;
    photoURL: string;
    description: string;
    hometown: string;
    uid: string;
    studies: (string | never)[];
    works: (string | never)[];
    contacts: { [x: string]: any };
    status: STATUS.active;
    accept_all_invitations: boolean;
}

export type TGroupMembersBasicDetails = {
    id: string;
    addedBy: string;
    nickname: string;
    role: ROLE;
};

type TLastMessage<T> = {
    message: string;
    sentTime: Timestamp;
    by: T;
    seenBy: T[];
};

export interface IGroupDetails {
    id: string;
    name: string;
    emoji: string;
    inviteLink: string;
    groupMembers: IGroupDetails["id"][];
    lastMessage: TLastMessage<IGroupDetails["id"]>;
    groupMembersBasicDetails: TGroupMembersBasicDetails[];
    photoURL: string;
}

export type TNotificationType = "join-group" | "info-message";

export interface INotification {
    id: string;
    receiverId: string[];
    type: TNotificationType;
    photoURL: string | null;
    time: Timestamp;
    description: string;
    extraInformation: {
        [x: string]: any;
    };
    seen: {
        id: UserType["uid"];
        done: boolean;
    }[];
}
