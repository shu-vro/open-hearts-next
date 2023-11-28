"use client";

import React from "react";
import ProfilePage from "../page";
import { useParams, useRouter } from "next/navigation";
import { SITEMAP } from "@/lib/variables";

export default function OthersProfile() {
    const { push } = useRouter();
    const params = useParams();
    if (!params || !params?.uid) {
        push(SITEMAP.chats);
        return "";
    }
    return <ProfilePage uid={params.uid as string} />;
}
