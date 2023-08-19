"use client";
import { auth } from "@/firebase.js";
import { signOut } from "firebase/auth";
import { Button } from "@mui/material";
import {useRouter} from 'next/navigation';

export default function Logout() {
    const router = useRouter();
    return (
        <Button
            type="button"
            variant="contained"
            onClick={async () => {
                try {
                    await signOut(auth);
                    router.push('/login');
                } catch (e) {
                    console.log(e);
                }
            }}
        >
            Log Out
        </Button>
    );
}
