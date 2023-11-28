"use client";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";
import { SITEMAP } from "@/lib/variables";

export default function Logout() {
    return (
        <Button
            type="button"
            variant="contained"
            onClick={async () => {
                try {
                    await signOut(auth);
                    redirect(SITEMAP.login);
                } catch (e) {
                    console.log(
                        `%c${JSON.stringify(e, null, 2)}`,
                        "color: white;background: dodgerblue;border-radius: 5px;padding: 7px;font-size: 1.2em;"
                    );
                }
            }}
        >
            Log Out
        </Button>
    );
}
