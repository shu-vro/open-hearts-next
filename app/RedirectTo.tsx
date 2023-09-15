"use client";
import { useRouter, redirect } from "next/navigation";
import { useEffect } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Chats() {
    process.env.NODE_ENV === "development" && redirect("/chats");
    const { push } = useRouter();
    useEffect(() => {
        let unsubscribe = onAuthStateChanged(auth, (user) => {
            user ? push("/chats") : push("/signup");
        });
        return unsubscribe;
    }, []);
    return <></>;
}
