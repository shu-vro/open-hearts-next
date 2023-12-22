import { MessageType } from "@/app";
import { useEffect } from "react";
import { firestoreDb } from "@/firebase";
import { DATABASE_PATH } from "@/lib/variables";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { useAllMessages } from "@/contexts/AllMessagesContext";

export default function useFetchAllMessages(groupId: string) {
    const { messages, setMessages } = useAllMessages();
    useEffect(() => {
        const q = query(
            collection(
                firestoreDb,
                DATABASE_PATH.groupDetails,
                groupId,
                DATABASE_PATH.messages
            ),
            orderBy("created_at" as keyof MessageType)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                setMessages(
                    snapshot.docs.map((doc) => {
                        return doc.data();
                    }) as MessageType[]
                );
            } else {
                setMessages([]);
            }
        });
        return unsubscribe;
    }, []);
    return messages;
}
