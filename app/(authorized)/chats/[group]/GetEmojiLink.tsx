"use client";

export default function GetEmojiLink({
    unified,
    size = 50,
    style = {},
}: {
    unified: string;
    size?: number;
    style?: React.CSSProperties;
}) {
    return (
        <>
            <img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-facebook/img/facebook/64/${unified}.png`}
                alt=""
                style={{ ...style }}
                width={size}
                loading="lazy"
            />
        </>
    );
}
