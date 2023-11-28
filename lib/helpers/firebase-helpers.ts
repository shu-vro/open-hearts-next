import { firestoreDb, auth } from "@/firebase";
import { DATABASE_PATH } from "@/lib/variables";
import { IGroupDetails, MessageType, TGroupMembersBasicDetails } from "@/app";
import {
    Timestamp,
    collection,
    doc,
    getDoc,
    getDocs,
    limitToLast,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";
import { DEFAULT_GROUP_DETAILS } from "@/lib/variables";
import { nanoid } from "nanoid";
import { determineMessageType } from "../utils";
import { ROLE } from "@/lib/variables";

/**
 * This function creates a group if there is no groupId, or
 * gets a groupDetails if searchParams have one. (done in groupContext.tsx file).
 * It takes another optional parameter `redirectToAnotherGroupIdIfDoes_notExist`
 * this parameter will decide what if the `searchParam.get("groupId")` is wrong,
 * will it leave it as it is (undefined) or redirect to another groupId.
 * @param {string | undefined} groupId string or undefined
 * @param {boolean | undefined} redirectToAnotherGroupIdIfDoes_notExist boolean or undefined
 * @returns
 */
export async function FirstTimeOpeningGroup(
    redirectToAnotherGroupIdIfDoes_notExist?: boolean,
    obj?: {
        name: string;
        invited: IGroupDetails["groupMembersBasicDetails"];
    },
    groupId?: string
) {
    try {
        if (!auth.currentUser) throw new Error("Not authenticated");
        if (typeof groupId === "string") {
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
                        auth.currentUser.uid || ""
                    ),
                    limitToLast(1)
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
                groupMembers: [
                    auth.currentUser.uid,
                    ...(obj?.invited.map((e) => e.id) || []),
                ],
                groupMembersBasicDetails: [
                    {
                        id: auth.currentUser.uid,
                        addedBy: "owner",
                        nickname: auth.currentUser.displayName,
                        role: ROLE.owner,
                    },
                    ...(obj?.invited || []),
                ],
                inviteLink: `/chats/${groupId}`,
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

export async function changeGroupInformation(
    groupId: string,
    obj: Partial<IGroupDetails>
) {
    try {
        await setDoc(
            doc(firestoreDb, DATABASE_PATH.groupDetails, groupId),
            obj,
            { merge: true }
        );
    } catch (e) {
        alert("error\nCheck console");
        console.warn(e);
    }
}

/**
 * Both creates and sets in group.
 */
export async function setChatMessage(
    groupId: string,
    obj: Partial<MessageType>,
    by?: TGroupMembersBasicDetails,
    chatId: string | null = null
) {
    const id = chatId || nanoid();
    try {
        if (!by) throw new Error("Sent by not defined!");
        const typeOfMessage = determineMessageType(obj);
        await setDoc(
            doc(
                firestoreDb,
                DATABASE_PATH.groupDetails,
                groupId,
                "messages",
                id
            ),
            { ...obj, id },
            { merge: true }
        );
        await setDoc(
            doc(firestoreDb, DATABASE_PATH.groupDetails, groupId),
            {
                lastMessage: {
                    by: by.nickname,
                    message:
                        typeOfMessage === "text"
                            ? obj.text
                            : `sent a ${typeOfMessage}`,
                    seenBy: [by.id],
                    sentTime: serverTimestamp() as Timestamp,
                },
            } as Partial<IGroupDetails>,
            { merge: true }
        );
    } catch (e) {
        alert("error\nCheck console");
        console.table({ e, obj, by, chatId, groupId });
    }
}
