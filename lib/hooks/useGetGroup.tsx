import { IGroupDetails, UserType } from "@/app";
import { useEffect } from "react";
import { firestoreDb } from "@/firebase";
import { DATABASE_PATH } from "@/lib/variables";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { Unsubscribe } from "firebase/database";
import { useGroup } from "@/contexts/GroupContext";
import { useUsers } from "@/contexts/UsersInGroupContext";

export default function useGetGroup(
    groupId: string,
    redirectToAnotherGroupIdIfDoes_notExist?: boolean
) {
    const { group, setGroup } = useGroup();
    const { setAllUsers } = useUsers();

    useEffect(() => {
        const q = doc(firestoreDb, DATABASE_PATH.groupDetails, groupId || "");
        let unsubscribe: Unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.exists()) {
                const groupData = querySnapshot.data() as IGroupDetails;
                setGroup(groupData);
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

    useEffect(() => {
        if (!group) return;
        (async () => {
            if (group.groupMembers.length >= 30) {
                // BEST OPTION, BUT SLOW

                let allUsers = group.groupMembersBasicDetails.map(
                    async (member) => {
                        let q = doc(
                            firestoreDb,
                            DATABASE_PATH.users,
                            member.id
                        );

                        try {
                            let user = await getDoc(q);
                            return user.data() as UserType;
                        } catch (error) {
                            return null as unknown as UserType;
                        }
                    }
                );

                let x = await Promise.all(allUsers);
                setAllUsers(x.filter((e) => e));
            } else {
                // FASTEST OPTION, BUT RISKY. AT MOST 30 ACCEPTED

                let allUsers = await getDocs(
                    query(
                        collection(firestoreDb, DATABASE_PATH.users),
                        where("uid", "in", group.groupMembers)
                    )
                );

                setAllUsers(allUsers.docs.map((e) => e.data() as UserType));
            }
        })();
    }, [group?.groupMembersBasicDetails]);

    return group;
}
