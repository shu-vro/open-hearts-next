"use client";

import * as React from "react";

type VideoElementProps = {
    srcObject: MediaStream | MediaSource;
} & React.HTMLProps<HTMLVideoElement>;

function VideoElement({ srcObject, ...rest }: VideoElementProps) {
    const video = React.useRef<HTMLVideoElement>(null);
    React.useEffect(() => {
        console.log(srcObject);
        if (video.current) {
            video.current.srcObject = srcObject;
        }
    }, [srcObject]);

    return (
        <video
            style={{
                width: "50%",
                height: "150%",
                border: "1px solid red",
                transform: "rotateY(180deg)",
            }}
            autoPlay
            loop
            {...rest}
            ref={video}
            // controls
        ></video>
    );
}

export default function VideoComponent() {
    const [Videos, setVideos] = React.useState<VideoElementProps[]>([]);

    React.useEffect(() => {
        (async () => {
            let mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            // myVideo.current!.srcObject = mediaStream;
            setVideos((prev) => {
                prev.push({ srcObject: mediaStream, muted: true });
                return [...prev];
            });
        })();
    }, []);

    return (
        <div className="grow p-3 w-full h-full">
            <div className="videos flex justify-center items-center flex-wrap w-full">
                <video
                    style={{
                        width: "50%",
                        height: "150%",
                        border: "1px solid red",
                        transform: "rotateY(180deg)",
                    }}
                    autoPlay
                    loop
                    id="my_video"
                    // controls
                ></video>
                {Videos.map(({ srcObject, ...rest }, i) => (
                    <VideoElement srcObject={srcObject} {...rest} key={i} />
                ))}
            </div>
        </div>
    );
}
