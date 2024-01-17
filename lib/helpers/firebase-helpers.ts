import { firestoreDb, auth, storage } from "@/firebase";
import { DATABASE_PATH } from "@/lib/variables";
import {
    IGroupDetails,
    INotification,
    MessageType,
    TGroupMembersBasicDetails,
    UserType,
} from "@/app";
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
import { ROLE } from "@/lib/variables";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

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
        invited: (TGroupMembersBasicDetails & {
            should_be_added_automatically: UserType["accept_all_invitations"];
        })[];
        /**
         * base64 string
         */
        photoURL: string;
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
            // CREATE NEW GROUP

            const groupId = nanoid();
            const storageRef = ref(storage, groupId + "/profile");
            const result = await uploadString(
                storageRef,
                obj?.photoURL || "",
                "data_url"
            );
            let photoURL = await getDownloadURL(result.ref);

            let setThisObject = {
                ...DEFAULT_GROUP_DETAILS,
                id: groupId,
                name: obj?.name || "",
                groupMembers: [
                    auth.currentUser.uid,
                    ...(obj?.invited
                        .filter((member) => {
                            return member.should_be_added_automatically;
                        })
                        .map((e) => e.id) || []),
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
                photoURL:
                    photoURL ||
                    "https://img.fixthephoto.com/blog/images/gallery/news_preview_mob_image__preview_404.jpg",
            } as IGroupDetails;

            await setDoc(
                doc(firestoreDb, DATABASE_PATH.groupDetails, groupId),
                setThisObject,
                {
                    merge: true,
                }
            );
            // SEND NOTIFICATIONS TO THEM

            const notificationId = nanoid();

            await setDoc(
                doc(firestoreDb, DATABASE_PATH.notifications, notificationId),
                {
                    id: notificationId,
                    receiverId: obj?.invited.map((e) => e.id),
                    description: ``,
                    photoURL,
                    time: serverTimestamp() as Timestamp,
                    extraInformation: {
                        groupId,
                        role: "member",
                        groupName: obj?.name,
                    },
                    seen: obj?.invited.map((e) => ({ id: e.id, done: false })),
                } as INotification,
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
                    message: obj.id,
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
