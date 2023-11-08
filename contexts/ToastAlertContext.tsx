"use client";

import React, { createContext, useContext, useState } from "react";

const Context = createContext({} as UseToastAlertProp);

type UseToastAlertProp = {
    message: string;
    setMessage: React.Dispatch<
        React.SetStateAction<UseToastAlertProp["message"]>
    >;
};
export function useToastAlert() {
    return useContext(Context);
}

export default function ToastAlertContext({
    children,
}: {
    children: React.ReactNode;
}) {
    const [message, setMessage] = useState<UseToastAlertProp["message"]>("");
    return (
        <>
            <Context.Provider value={{ message, setMessage }}>
                {children}
            </Context.Provider>
        </>
    );
}
