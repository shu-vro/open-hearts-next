"use client";

import { IGroupDetails } from "@/app";
import React, { createContext, useContext, useState } from "react";

const Context = createContext({} as UseGroupProp);

type UseGroupProp = {
    group: IGroupDetails | null;
    setGroup: React.Dispatch<React.SetStateAction<UseGroupProp["group"]>>;
};
export function useGroup() {
    return useContext(Context);
}

export default function GroupContext({
    children,
}: {
    children: React.ReactNode;
}) {
    const [group, setGroup] = useState<UseGroupProp["group"]>(null);
    return (
        <>
            <Context.Provider value={{ group, setGroup }}>
                {children}
            </Context.Provider>
        </>
    );
}
