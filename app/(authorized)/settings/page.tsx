"use client";

import { SITEMAP } from "@/lib/variables";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const router = useRouter();
    useEffect(() => {
        router.push(SITEMAP.general_settings);
    }, []);

    return "";
};

export default Page;
