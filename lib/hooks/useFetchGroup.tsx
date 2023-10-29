import { useState, useEffect } from "react";
import { DATABASE_PATH } from "../variables";
import { IGroupDetails } from "@/app";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, firestoreDb } from "@/firebase";

export default function useFetchGroup() {
    const [groups, setGroups] = useState<IGroupDetails[]>([]);

    useEffect(() => {
        const q = query(
            collection(firestoreDb, DATABASE_PATH.groupDetails),
            where("groupMembers", "array-contains", auth.currentUser?.uid)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setGroups(
                querySnapshot.docs.map((doc) => doc.data() as IGroupDetails)
            );
        });
        return unsubscribe;
    }, []);

    return groups;
}
