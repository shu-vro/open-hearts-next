import "@mui/material/styles";

declare module "adapterjs" {}

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
    imageLink: string[];
    emoji: string;
    voice: string;
    deleted: boolean;
    hash: string | null;
    reply: IReplyMessage | null;
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
}
