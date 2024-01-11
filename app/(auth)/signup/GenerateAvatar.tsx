"use client";

import React, { useEffect, useState } from "react";
import Avatar, { type Props } from "avataaars";
import { cn } from "@/lib/utils";

function pickRandom(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const topType = [
    "NoHair",
    "Eyepatch",
    "Hat",
    "Hijab",
    "Turban",
    "WinterHat1",
    "WinterHat2",
    "WinterHat3",
    "WinterHat4",
    "LongHairBigHair",
    "LongHairBob",
    "LongHairBun",
    "LongHairCurly",
    "LongHairCurvy",
    "LongHairDreads",
    "LongHairFrida",
    "LongHairFro",
    "LongHairFroBand",
    "LongHairNotTooLong",
    "LongHairShavedSides",
    "LongHairMiaWallace",
    "LongHairStraight",
    "LongHairStraight2",
    "LongHairStraightStrand",
    "ShortHairDreads01",
    "ShortHairDreads02",
    "ShortHairFrizzle",
    "ShortHairShaggyMullet",
    "ShortHairShortCurly",
    "ShortHairShortFlat",
    "ShortHairShortRound",
    "ShortHairShortWaved",
    "ShortHairSides",
    "ShortHairTheCaesar",
    "ShortHairTheCaesarSidePart",
];

const accessoriesType = [
    "Blank",
    "Kurt",
    "Prescription01",
    "Blank",
    "Prescription02",
    "Blank",
    "Round",
    "Blank",
    "Sunglasses",
    "Wayfarers",
    "Blank",
];

const facialHairType = [
    "Blank",
    "BeardMedium",
    "BeardLight",
    "BeardMagestic",
    "MoustacheFancy",
    "MoustacheMagnum",
];

const facialHairColor = [
    "Auburn",
    "Black",
    "Blonde",
    "BlondeGolden",
    "Brown",
    "BrownDark",
    "Platinum",
    "Red",
];

const clotheType = [
    "BlazerShirt",
    "BlazerSweater",
    "CollarSweater",
    "GraphicShirt",
    "Hoodie",
    "Overall",
    "ShirtCrewNeck",
    "ShirtScoopNeck",
    "ShirtVNeck",
];

const eyeType = [
    "Default",
    "Happy",
    "Hearts",
    "Side",
    "Wink",
    "Squint",
    "WinkWacky",
    // "Close",
    // "Cry",
    // "Dizzy",
    // "EyeRoll",
    // "Surprised",
];

const eyebrowType = [
    "Default",
    "DefaultNatural",
    "FlatNatural",
    "RaisedExcited",
    "RaisedExcitedNatural",
    "UpDown",
    "UpDownNatural",
    "SadConcerned",
    "SadConcernedNatural",

    // "Angry",
    // "AngryNatural",
    // "UnibrowNatural",
];

const mouthType = [
    // "Concerned",
    "Default",
    // "Disbelief",
    "Eating",
    "Grimace",
    // "Sad",
    "ScreamOpen",
    "Serious",
    "Smile",
    // "Tongue",
    "Twinkle",
    // "Vomit",
];

const skinColor = [
    "Tanned",
    "Pale",
    "Light",
    "Light",
    "Light",
    "Light",
    "Light",
    "Brown",
    "DarkBrown",
    "Black",
];

const hairColor = [
    "Auburn",
    "Black",
    "Blonde",
    "BlondeGolden",
    "Brown",
    "BrownDark",
    "PastelPink",
    "Platinum",
    "Red",
    "SilverGray",
];
const clotheColor = [
    "Black",
    "Blue01",
    "Blue02",
    "Blue03",
    "Gray01",
    "Gray02",
    "Heather",
    "PastelBlue",
    "PastelGreen",
    "PastelOrange",
    "PastelRed",
    "PastelYellow",
    "Pink",
    "Red",
    "White",
];

function extractBaseURL(element: Node) {
    var serializer = new XMLSerializer();
    var raw = serializer.serializeToString(element);
    var encoded = raw.replace(/\s+/g, " ");

    // According to Taylor Hunt, lowercase gzips better ... my tiny test confirms this
    encoded = encoded.replaceAll("%", "%25");
    encoded = encoded.replaceAll("> <", "><"); // normalise spaces elements
    encoded = encoded.replaceAll("; }", ";}"); // normalise spaces css
    encoded = encoded.replaceAll("<", "%3c");
    encoded = encoded.replaceAll(">", "%3e");
    encoded = encoded.replaceAll('"', "'");
    encoded = encoded.replaceAll("#", "%23"); // needed for ie and firefox
    encoded = encoded.replaceAll("{", "%7b");
    encoded = encoded.replaceAll("}", "%7d");
    encoded = encoded.replaceAll("|", "%7c");
    encoded = encoded.replaceAll("^", "%5e");
    encoded = encoded.replaceAll("`", "%60");
    encoded = encoded.replaceAll("@", "%40");

    // charset reportedly not needed ... I need to test before implementing
    var uri = "data:image/svg+xml;charset=UTF-8," + encoded + "";

    return uri;
}

export default function GenerateAvatar({
    setPhotoURL,
}: {
    setPhotoURL: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [isClient, setIsClient] = useState(false);
    const [config, setConfig] = useState({
        topType: pickRandom(topType),
        accessoriesType: pickRandom(accessoriesType),
        hairColor: pickRandom(hairColor),
        facialHairType: pickRandom(facialHairType),
        facialHairColor: pickRandom(facialHairColor),
        clotheType: pickRandom(clotheType),
        clotheColor: pickRandom(clotheColor),
        eyeType: pickRandom(eyeType),
        eyebrowType: pickRandom(eyebrowType),
        mouthType: pickRandom(mouthType),
        skinColor: pickRandom(skinColor),
    });
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;
        const avatar = document.querySelector(".avatar");

        const uri = extractBaseURL(avatar as Node);
        setPhotoURL(uri);
    }, [config]);

    return isClient ? (
        <button
            type="button"
            className="bg-transparent m-0 p-0 border-none"
            onClick={() => {
                setConfig({
                    topType: pickRandom(topType),
                    accessoriesType: pickRandom(accessoriesType),
                    hairColor: pickRandom(hairColor),
                    facialHairType: pickRandom(facialHairType),
                    facialHairColor: pickRandom(facialHairColor),
                    clotheType: pickRandom(clotheType),
                    clotheColor: pickRandom(clotheColor),
                    eyeType: pickRandom(eyeType),
                    eyebrowType: pickRandom(eyebrowType),
                    mouthType: pickRandom(mouthType),
                    skinColor: pickRandom(skinColor),
                });
            }}
        >
            <Avatar
                key={1}
                className={cn("avatar my-4")}
                style={{ width: "200px", height: "200px" }}
                avatarStyle="Circle"
                {...config}
            />
        </button>
    ) : null;
}
