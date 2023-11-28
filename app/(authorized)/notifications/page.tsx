import Notification from "./Notification";

export default async function Notifications() {
    const response = await fetch("https://jsonplaceholder.org/posts");
    const data: object[] = await response.json();

    return (
        <div className="w-full h-full flex flex-col justify-start items-start gap-4 max-[668px]:gap-2 overflow-y-auto">
            {data.map((e: any, i: number) => (
                <Notification
                    name={e.slug}
                    photoURL={e.thumbnail}
                    time={e.publishedAt}
                    description={e.content}
                    url={e.url}
                    key={i}
                />
            ))}
        </div>
    );
}
