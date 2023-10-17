import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import numeral from "numeral";
import { UserType } from "@/app";

export function repeat(text: string, count: number = 1) {
    let result = "";
    for (let i = 0; i < count; i++) {
        if (i === count - 1) {
            result += text;
        } else result += text + " ";
    }
    return result;
}

export function normalizeTimeFormat(number: number) {
    let a: string = numeral(number).format("00:00:00");
    if (a.substring(0, 2) === "0:") {
        a = a.substring(2, a.length);
        return a;
    }
    return a;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function testPassword(password: string) {
    if (password.length < 8)
        return "Password Length Must Be Greater Than 7 Characters.";
    else if (!/\d/.test(password)) return "Must Contain At Least One Digit";
    else if (!/[a-z]/.test(password))
        // Corrected condition
        return "Must Contain At Least One Small Case";
    else if (/\s/.test(password))
        // Corrected condition
        return "No WhiteSpaces";
    else if (!/[A-Z]/.test(password))
        return "Must Contain At Least One Capital Case";
    else if (!/[`~!@#$%^&*()\-=+\\|{}\[\];:'",.<>\/?]/.test(password))
        // Corrected condition
        return "Must Contain At Least One Special Character";
    else return "";
}

export function clarify_rows<T>(rows: T[], primary_key: keyof T): T[] {
    if (rows.length === 0) {
        return [];
    }

    const primaryKeys: T[keyof T][] = [];

    const sortedRows = rows.map((e) => {
        primaryKeys.push(e[primary_key]);
        delete e[primary_key];
        return e;
    });
    const firstRow = sortedRows[0];

    // Reorder the fields in other rows to match the first row
    const reorderedRows = sortedRows.map((row, i) => {
        const reorderedRow: { [x: string]: T[keyof T] } = {
            [primary_key]: primaryKeys[i],
        };
        for (const key in firstRow) {
            if (typeof row[key] !== "function") {
                if (typeof row[key] !== "object") {
                    reorderedRow[key] = row[key];
                }
            }
        }
        return reorderedRow as T;
    });

    return reorderedRows;
}

export const DefaultUserConfig = {
    name: "",
    email: "",
    photoURL: "",
    description: `a fantastic friend who's smart, compassionate, and full of life. They bring positivity wherever they go`,
    hometown: "",
    uid: "",
    studies: [],
    works: [],
} as UserType;

export enum DATABASE_PATH {
    users = "users",
}
