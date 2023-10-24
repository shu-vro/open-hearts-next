"use client";

import { FirstTimeOpeningGroup } from "@/lib/helpers/firebase-helpers";
import { IGroupDetails, SITEMAP } from "@/lib/variables";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Context = createContext({} as UseGroupProp);

type UseGroupProp = {
    group: IGroupDetails;
    setGroup: React.Dispatch<React.SetStateAction<IGroupDetails>>;
};
export function useGroup() {
    return useContext(Context);
}

export default function GroupContext({
    children,
}: {
    children: React.ReactElement;
}) {
    const { push } = useRouter();
    const params = useSearchParams();
    const [group, setGroup] = useState({} as IGroupDetails);
    return (
        <>
            <Context.Provider value={{ group, setGroup }}>
                {children}
                <button
                    onClick={() => {
                        (async () => {
                            let tempGroup = await FirstTimeOpeningGroup(
                                params
                                    ? (params.get("groupId") as string)
                                    : group?.id,
                                true
                            );
                            console.log(tempGroup);
                            if (!tempGroup) return;
                            setGroup(tempGroup);
                            push(SITEMAP.chats + `?groupId=${tempGroup.id}`);
                        })();
                    }}
                    className="absolute top-0 left-0 z-50"
                >
                    create a collection (testing only)
                </button>
            </Context.Provider>
        </>
    );
}
