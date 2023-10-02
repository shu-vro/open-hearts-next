// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
    getFirestore,
    connectFirestoreEmulator,
    doc,
    setDoc,
    getDoc,
    query,
    collection,
    where,
    getDocs,
} from "firebase/firestore";
import {
    getAuth,
    connectAuthEmulator,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { DATABASE_PATH, DefaultUserConfig } from "@/lib/utils";
// @ts-ignore
import encoding from "encoding";
import { UserType } from "./app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default app;
// const analytics = getAnalytics(app);

export const storage = getStorage(app);

export const db = getDatabase(app);

export const auth = getAuth(app);

export const firestoreDb = getFirestore(app);
if (globalThis?.location?.hostname === "localhost") {
    connectStorageEmulator(storage, "127.0.0.1", 4007);
    connectDatabaseEmulator(db, "127.0.0.1", 4004);
    connectAuthEmulator(auth, "http://127.0.0.1:4001");
    connectFirestoreEmulator(firestoreDb, "127.0.0.1", 4003);
}

async function setDocumentToUsersCollection(
    uid: string,
    obj: { [x: string]: any }
) {
    try {
        await setDoc(doc(firestoreDb, DATABASE_PATH.users, uid), obj, {
            merge: true,
        });
        return;
    } catch (error) {
        console.warn(error);
        return alert("there was an error on setDocumentToUsersCollection");
    }
}

export async function createUserWithPassword(
    name: string,
    photoURL: string,
    email: string,
    password: string
) {
    try {
        let { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        await setDocumentToUsersCollection(user.uid, {
            ...DefaultUserConfig,
            uid: user.uid,
            name,
            email,
        } as UserType);
        await updateProfile(auth.currentUser!, {
            displayName: name,
            photoURL,
        });
        return user;
    } catch (e) {
        console.warn(e);
        alert("There was an error at createUserWithPassword");
        await signOut(auth);
    }
}

export async function loginWithPassword(email: string, password: string) {
    try {
        let { user } = await signInWithEmailAndPassword(auth, email, password);
        return user;
    } catch (e) {
        console.warn(e);
        alert("There was an error at loginWithPassword");
    }
}

export async function signInWithGoogle() {
    try {
        let provider = new GoogleAuthProvider();
        let { user } = await signInWithPopup(auth, provider);

        const userExists = await getDocs(
            query(
                collection(firestoreDb, DATABASE_PATH.users),
                where("uid", "==", user.uid)
            )
        );
        if (userExists.size !== 0) {
            return user;
        }
        console.log(userExists.size);
        await setDocumentToUsersCollection(user.uid, {
            ...DefaultUserConfig,
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
        } as UserType);
        return user;
    } catch (e) {
        console.warn(e);
        alert("There was an error at signInWithGoogle");
        await signOut(auth);
    }
}

export { sendPasswordResetEmail };
