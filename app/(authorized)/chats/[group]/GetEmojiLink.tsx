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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
