"use client";

import Notification from "./Notification";
import { INotification } from "@/app";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestoreDb } from "@/firebase";
import { DATABASE_PATH, SITEMAP } from "@/lib/variables";

export default function ParseNotifications({
    iconOnly = false,
    notifications,
}: {
    notifications: INotification[];
    iconOnly?: boolean;
}) {
    return (
        <div className="w-full h-full flex flex-col justify-start items-start gap-4 max-[668px]:gap-2 overflow-y-auto">
            {notifications.map((e, i: number) => (
                <Notification
                    name={e.extraInformation.groupName}
                    photoURL={e.photoURL}
                    time={e.time}
                    description={`You are requested to join <span style="color: dodgerblue;">${e.extraInformation.groupName}</span> as a/an <span style="color: magenta;">${e.extraInformation.role}</span>`}
                    url={`${globalThis.location.origin}${SITEMAP.chats}/${e.extraInformation.groupId}`}
                    seenData={e.seen}
                    iconOnly={iconOnly}
                    onClick={async () => {
                        if (!auth.currentUser) return;

                        if (
                            e.seen.findIndex(
                                (member) =>
                                    member.id === auth.currentUser?.uid &&
                                    member.done === false
                            ) > -1
                        ) {
                            await setDoc(
                                doc(
                                    firestoreDb,
                                    DATABASE_PATH.notifications,
                                    e.id
                                ),
                                {
                                    seen: e.seen.map((member) => {
                                        if (member.id === auth.currentUser?.uid)
                                            return {
                                                id: member.id,
                                                done: true,
                                            };
                                        return member;
                                    }),
                                } as INotification,
                                {
                                    merge: true,
                                }
                            );
                        }
                    }}
                    key={i}
                />
            ))}
        </div>
    );
}
