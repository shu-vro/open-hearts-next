"use client";

import useNotifications from "@/lib/hooks/useNotifications";
import ParseNotifications from "./ParseNotifications";

export default function Notifications() {
    const notifications = useNotifications();
    return <ParseNotifications notifications={notifications} />;
}
