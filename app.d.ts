/// <reference types="original-module" />

import "@mui/material/styles";
import { STATUS } from "@/types/app";
import { FieldValue, serverTimestamp, Timestamp } from "firebase/firestore";

// declare module "adapterjs" {}

declare function serverTimestamp(): Timestamp;

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

declare type MessageType = {
    id: string;
    text: string;
    emoji: string;
    hash: string | null;
    deleted: boolean;
    imageLink: string[];
    voice: string;
    reply: string | null;
    reactions: {
        [x: string]: number;
    };
    created_at: Timestamp;
    sender_id: string;
};

export type TypesOfMessage = "text" | "image" | "emoji" | "voice";

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
}

export type TGroupMembersBasicDetails = Partial<{
    id: string;
    addedBy: string;
    nickname: string;
}>;

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
