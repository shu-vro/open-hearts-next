import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
