import { firestoreDb, auth } from "@/firebase";
import { DATABASE_PATH, IGroupDetails } from "@/lib/variables";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { DEFAULT_GROUP_DETAILS } from "@/lib/variables";
import { nanoid } from "nanoid";

/**
 * This function creates a group if there is no groupId, or
 * gets a groupDetails if searchParams have one. (done in groupContext.tsx file).
 * It takes another optional parameter `redirectToAnotherGroupIdIfDoes_notExist`
 * this parameter will deside what if the `searchParam.get("groupId")` is wrong,
 * will it leave it as it is (undefined) or redirect to another groupId.
 * @param {string | undefined} groupId string or undefined
 * @param {boolean | undefined} redirectToAnotherGroupIdIfDoes_notExist boolean or undefined
 * @returns
 */
export async function FirstTimeOpeningGroup(
    redirectToAnotherGroupIdIfDoes_notExist?: boolean,
    obj?: {
        name: string;
        invited: string[];
    },
    groupId?: string
) {
    try {
        if (!auth.currentUser) throw new Error("Not authenticated");
        if (!!groupId) {
            const docRef = doc(
                firestoreDb,
                DATABASE_PATH.groupDetails,
                groupId
            );
            const docSnap = await getDoc(docRef);
            if (!redirectToAnotherGroupIdIfDoes_notExist) {
                return docSnap.data() as IGroupDetails;
            } else {
                const q = query(
                    collection(firestoreDb, DATABASE_PATH.groupDetails),
                    where(
                        "groupMembers",
                        "array-contains",
                        auth.currentUser.uid
                    )
                );
                const snapshots = await getDocs(q);
                if (!snapshots.empty) {
                    return snapshots.docs[0].data() as IGroupDetails;
                } else {
                    return undefined;
                }
            }
        } else {
            const groupId = nanoid();
            let setThisObject = {
                ...DEFAULT_GROUP_DETAILS,
                id: groupId,
                name: obj?.name || "",
                groupMembers: [auth.currentUser.uid, ...(obj?.invited || [])],
            } as IGroupDetails;

            await setDoc(
                doc(firestoreDb, DATABASE_PATH.groupDetails, groupId),
                setThisObject,
                {
                    merge: true,
                }
            );

            return setThisObject;
        }
    } catch (error) {
        console.warn(error);
        return alert("there was an error on testing file");
    }
}
