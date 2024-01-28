import { INotification } from "@/app";
import { auth, firestoreDb } from "@/firebase";
import {
    Unsubscribe,
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { DATABASE_PATH } from "../variables";

export default function useNotifications() {
    const [notifications, setNotifications] = useState<INotification[]>([]);

    useEffect(() => {
        let unsubscribe: Unsubscribe;
        let interval = setInterval(() => {
            if (auth.currentUser) {
                const q = query(
                    collection(firestoreDb, DATABASE_PATH.notifications),
                    where("receiverId", "array-contains", auth.currentUser.uid),
                    orderBy("time", "desc")
                );

                unsubscribe = onSnapshot(q, (snapshot) => {
                    if (!snapshot.empty) {
                        setNotifications(
                            (
                                snapshot.docs.map((doc) => {
                                    return doc.data();
                                }) as INotification[]
                            ).sort((a, b) => {
                                let a_seen_by_me = a.seen.find(
                                    (element) =>
                                        element.id === auth.currentUser?.uid &&
                                        element.done === false
                                );
                                let b_seen_by_me = b.seen.find(
                                    (element) =>
                                        element.id === auth.currentUser?.uid &&
                                        element.done === false
                                );

                                if (a_seen_by_me?.done !== b_seen_by_me?.done) {
                                    return a_seen_by_me?.done ? 1 : -1;
                                } else {
                                    return 0;
                                }
                            })
                        );
                    } else {
                        setNotifications([]);
                    }
                });

                clearInterval(interval);
            }
        }, 1000);

        return () => {
            if (typeof unsubscribe === "function") {
                unsubscribe();
            }
        };
    }, []);

    return notifications;
}
