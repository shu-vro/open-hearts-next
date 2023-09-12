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
    reply: IReplyMessage | null;
};

declare interface IReplyMessage {
    message: MessageType;
    type: TypesOfMessage;
    to: string;
}
