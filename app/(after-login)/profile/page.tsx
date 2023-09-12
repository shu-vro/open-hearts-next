import React from "react";
import Canvas3D from "./Canvas3D";

export default function Page() {
    return (
        <div className="w-full grow h-[calc(100%-4rem)]">
            <div className="chat-section w-full overflow-y-auto h-full relative">
                <Canvas3D />
            </div>
        </div>
    );
}
