"use client";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();
    return (
        <Button
            type="button"
            variant="contained"
            onClick={async () => {
                try {
                    await signOut(auth);
                    router.push("/login");
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
