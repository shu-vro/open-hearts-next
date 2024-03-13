import { MessageType } from "@/app";
import { useEffect } from "react";
import { auth, firestoreDb } from "@/firebase";
import { DATABASE_PATH, SITEMAP } from "@/lib/variables";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useAllMessages } from "@/contexts/AllMessagesContext";
import { useGroup } from "@/contexts/GroupContext";
import { useRouter } from "next/navigation";
import sanitize from "../helpers/rehype-purify";

export default function useFetchAllMessages(groupId: string) {
    const { messages, setMessages } = useAllMessages();
    const { push } = useRouter();
    const { group } = useGroup();

    useEffect(() => {
        if (!group) return;
        if (!auth.currentUser) return push(SITEMAP.login);
        if (!group.groupMembers.includes(auth.currentUser.uid)) {
            return push(SITEMAP.chats);
        }

        const q = query(
            collection(
                firestoreDb,
                DATABASE_PATH.groupDetails,
                groupId,
                DATABASE_PATH.messages
            ),
            orderBy("created_at" as keyof MessageType)
        );
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (!snapshot.empty) {
                const docs: Promise<MessageType>[] = snapshot.docs.map(
                    async (doc) => {
                        const data = doc.data() as MessageType;
                        data.text = await sanitize(data.text);
                        return data;
                    }
                );

                const docsParsed: MessageType[] = await Promise.all(docs);
                setMessages(docsParsed);
            } else {
                setMessages([]);
            }
        });
        return unsubscribe;
    }, [group]);
    return messages;
}
