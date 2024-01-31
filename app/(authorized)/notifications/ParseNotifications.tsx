"use client";

import Notification, { ExtraButton } from "./Notification";
import { INotification, TGroupMembersBasicDetails } from "@/app";
import {
    Timestamp,
    arrayRemove,
    arrayUnion,
    doc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { auth, firestoreDb } from "@/firebase";
import { DATABASE_PATH, ROLE, SITEMAP } from "@/lib/variables";
import { nanoid } from "nanoid";
import favicon from "@/app/favicon.ico";
import { useRouter } from "next/navigation";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { useState } from "react";
import { sendInfoMessageToGroup } from "@/lib/helpers/firebase-helpers";

export default function ParseNotifications({
    iconOnly = false,
    notifications,
}: {
    notifications: INotification[];
    iconOnly?: boolean;
}) {
    const { push } = useRouter();
    const { setMessage } = useToastAlert();
    const [loading, setLoading] = useState(false);

    const removeFromReceiver = async (id: INotification["id"]) => {
        if (!auth.currentUser) return;
        await updateDoc(doc(firestoreDb, DATABASE_PATH.notifications, id), {
            receiverId: arrayRemove(auth.currentUser.uid),
        });
    };

    const sendNewNotificationForJoiningOrLeavingGroup = async (
        description: string
    ) => {
        if (!auth.currentUser) return;
        const notificationId = nanoid();
        try {
            await setDoc(
                doc(firestoreDb, DATABASE_PATH.notifications, notificationId),
                {
                    id: notificationId,
                    receiverId: [auth.currentUser.uid],
                    description: description,
                    type: "info-message",
                    photoURL: null,
                    time: serverTimestamp() as Timestamp,
                    seen: [
                        {
                            id: auth.currentUser.uid,
                            done: false,
                        },
                    ],
                } as INotification,
                {
                    merge: true,
                }
            );
        } catch (e) {
            console.log("PARSE NOTIFICATION", e);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-start items-start gap-4 max-[668px]:gap-2 overflow-y-auto">
            {notifications.map((notification, i: number) => (
                <Notification
                    key={i}
                    loading={loading}
                    name={
                        notification?.extraInformation?.groupName ||
                        "OPEN HEARTS"
                    }
                    photoURL={notification.photoURL || favicon.src}
                    time={notification.time}
                    description={
                        notification.description
                            ? notification.description
                            : `You are requested to join <span style="color: dodgerblue;">${notification.extraInformation.groupName}</span> as a/an <span style="color: magenta;">${notification.extraInformation.role}</span>`
                    }
                    url={
                        notification.type === "join-group"
                            ? `${SITEMAP.chats}/${notification?.extraInformation?.groupId}`
                            : SITEMAP.notifications
                    }
                    seenData={
                        notification.seen.findIndex(
                            (member) =>
                                member.id === auth.currentUser?.uid &&
                                member.done === true
                        ) > -1
                    }
                    iconOnly={iconOnly}
                    extraButtons={
                        notification.type === "join-group"
                            ? [
                                  <ExtraButton
                                      key={"join_button"}
                                      loading={loading}
                                      onClick={async (e) => {
                                          if (!auth.currentUser)
                                              return setMessage(
                                                  "Error: not authenticated"
                                              );

                                          setLoading(true);
                                          e.preventDefault();

                                          try {
                                              await updateDoc(
                                                  doc(
                                                      firestoreDb,
                                                      DATABASE_PATH.groupDetails,
                                                      notification
                                                          .extraInformation
                                                          .groupId
                                                  ),
                                                  {
                                                      groupMembers: arrayUnion(
                                                          auth.currentUser.uid
                                                      ),
                                                  }
                                              );

                                              await sendInfoMessageToGroup(
                                                  auth.currentUser.displayName +
                                                      ` joined the group`,
                                                  notification.extraInformation
                                                      .groupId as string,
                                                  {
                                                      addedBy: "",
                                                      id: auth.currentUser.uid,
                                                      nickname: auth.currentUser
                                                          .displayName as string,
                                                      role: ROLE.member,
                                                  }
                                              );

                                              await sendNewNotificationForJoiningOrLeavingGroup(
                                                  `Successfully added to ${(
                                                      notification
                                                          .extraInformation
                                                          .groupName as string
                                                  ).toUpperCase()} group`
                                              );
                                              await removeFromReceiver(
                                                  notification.id
                                              );
                                              push(
                                                  SITEMAP.chats +
                                                      `/` +
                                                      notification
                                                          .extraInformation
                                                          .groupId
                                              );
                                              setMessage(
                                                  "Successfully added to " +
                                                      notification
                                                          .extraInformation
                                                          .groupName
                                              );
                                          } catch (error: any) {
                                              setMessage(
                                                  "Error: " +
                                                      " updating group's information " +
                                                      error.message
                                              );
                                          }
                                          setLoading(false);
                                      }}
                                  >
                                      Accept
                                  </ExtraButton>,
                                  <ExtraButton
                                      key={"cancel_button"}
                                      loading={loading}
                                      onClick={async (e) => {
                                          if (!auth.currentUser)
                                              return setMessage(
                                                  "Error: not authenticated"
                                              );

                                          setLoading(true);

                                          e.preventDefault();
                                          e.stopPropagation();

                                          try {
                                              await removeFromReceiver(
                                                  notification.id
                                              );

                                              await sendNewNotificationForJoiningOrLeavingGroup(
                                                  `You cancelled group invitation for ${(
                                                      notification
                                                          .extraInformation
                                                          .groupName as string
                                                  ).toUpperCase()}`
                                              );
                                          } catch (error: any) {
                                              setMessage(
                                                  "Error: " +
                                                      " updating group's information " +
                                                      error.message
                                              );
                                          }
                                          setLoading(false);
                                      }}
                                  >
                                      Cancel
                                  </ExtraButton>,
                              ]
                            : undefined
                    }
                    onClick={async () => {
                        if (!auth.currentUser) return;

                        if (
                            notification.seen.findIndex(
                                (member) =>
                                    member.id === auth.currentUser?.uid &&
                                    member.done === false
                            ) > -1
                        ) {
                            setLoading(true);
                            try {
                                await setDoc(
                                    doc(
                                        firestoreDb,
                                        DATABASE_PATH.notifications,
                                        notification.id
                                    ),
                                    {
                                        seen: notification.seen.map(
                                            (member) => {
                                                if (
                                                    member.id ===
                                                    auth.currentUser?.uid
                                                )
                                                    return {
                                                        id: member.id,
                                                        done: true,
                                                    };
                                                return member;
                                            }
                                        ),
                                    } as INotification,
                                    {
                                        merge: true,
                                    }
                                );
                            } catch (error: any) {
                                setMessage("Error: toggling seen data");
                            }
                            setLoading(false);
                        }
                    }}
                />
            ))}
        </div>
    );
}
