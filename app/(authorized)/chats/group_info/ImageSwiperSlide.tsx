import React, { useState } from "react";
import { SwiperSlide } from "swiper/react";
import HoverWrapper from "../../HoverWrapper";
import { ImageList, ImageListItem } from "@mui/material";
import ImagePreviewModal from "../[group]/ImagePreviewModal";
import { MessageType } from "@/app";

export default function ImageSwiperSlide({
    messages,
}: {
    messages: MessageType[];
}) {
    const [showImageModal, setShowImageModal] = useState("");

    const handleClose = () => {
        setShowImageModal("");
    };

    let imageLink = messages
        .filter((msg) => !msg.deleted)
        .map((msg) => msg.imageLink)
        .flat(Infinity) as string[];
    return (
        <HoverWrapper className="w-[100%-1rem]">
            <ImageList
                variant="masonry"
                cols={3}
                gap={8}
                className="my-0 rounded-[inherit] w-[100%-1rem]"
            >
                {imageLink.map((src, i) => {
                    return (
                        <ImageListItem
                            key={i}
                            component="a"
                            href={`#${i + 1}`}
                            onClick={() => {
                                setShowImageModal(i.toString());
                            }}
                        >
                            <img
                                src={`${src}?w=248&fit=crop&auto=format`}
                                srcSet={`${src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                alt={src}
                                loading="lazy"
                            />
                        </ImageListItem>
                    );
                })}
                <ImagePreviewModal
                    images={imageLink}
                    handleClose={handleClose}
                    showImageModal={showImageModal}
                />
            </ImageList>
        </HoverWrapper>
    );
}
