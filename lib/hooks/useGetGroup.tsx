import { IGroupDetails } from "@/app";
import { useEffect, useState } from "react";
import { firestoreDb, auth } from "@/firebase";
import { DATABASE_PATH } from "@/lib/variables";
import { doc, onSnapshot } from "firebase/firestore";
import { Unsubscribe } from "firebase/database";
import { useGroup } from "@/contexts/GroupContext";

export default function useGetGroup(
    groupId: string,
    redirectToAnotherGroupIdIfDoes_notExist?: boolean
) {
    const { group, setGroup } = useGroup();

    useEffect(() => {
        const q = doc(firestoreDb, DATABASE_PATH.groupDetails, groupId || "");
        let unsubscribe: Unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.exists()) {
                setGroup(querySnapshot.data() as IGroupDetails);
            } else {
                unsubscribe();
                if (redirectToAnotherGroupIdIfDoes_notExist) {
                    const q = doc(
                        firestoreDb,
                        DATABASE_PATH.groupDetails,
                        groupId || ""
                    );
                    unsubscribe = onSnapshot(q, (querySnapshot) => {
                        if (querySnapshot.exists()) {
                            setGroup(querySnapshot.data() as IGroupDetails);
                        } else {
                            unsubscribe();
                        }
                    });
                }
            }
        });
        return unsubscribe;
    }, []);
    return group;
}
