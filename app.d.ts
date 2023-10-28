import "@mui/material/styles";
import { STATUS } from "@/types/app";

// declare module "adapterjs" {}

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
    text: string;
    emoji: string;
    hash: string | null;
    deleted: boolean;
    imageLink: string[];
    voice: string;
    reply: IReplyMessage | null;
    reactions: {
        [x: string]: number;
    };
};

declare interface IReplyMessage {
    message: MessageType;
    type: TypesOfMessage;
    to: string;
}

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
