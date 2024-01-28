"use client";

import { UserType } from "@/app";
import React, { createContext, useContext, useState } from "react";
import { DefaultUserConfig } from "@/lib/utils";

const Context = createContext({} as UseUserGroupProp);

type UseUserGroupProp = {
    allUsers: UserType[];
    setAllUsers: React.Dispatch<
        React.SetStateAction<UseUserGroupProp["allUsers"]>
    >;
    getUserById: (id: string) => UserType;
};
export function useUsers() {
    return useContext(Context);
}

export default function UsersInGroupContext({
    children,
}: {
    children: React.ReactNode;
}) {
    const [allUsers, setAllUsers] = useState<UseUserGroupProp["allUsers"]>([]);

    const getUserById = (id: string) => {
        return (
            allUsers.filter((user) => {
                return user.uid === id;
            })[0] || { ...DefaultUserConfig }
        );
    };
    return (
        <>
            <Context.Provider value={{ allUsers, setAllUsers, getUserById }}>
                {children}
            </Context.Provider>
        </>
    );
}
