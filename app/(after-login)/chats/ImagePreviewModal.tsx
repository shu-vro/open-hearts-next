import { AppBar, Button, Dialog } from "@mui/material";

import { IoCloseCircle } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, Keyboard } from "swiper/modules";

export default function ImagePreviewModal({
    showImageModal,
    handleClose,
    images,
}: {
    showImageModal: string;
    handleClose: () => void;
    images: string[];
}) {
    return (
        <Dialog open={Boolean(showImageModal)} fullScreen onClose={handleClose}>
            <AppBar
                className="flex justify-between items-center flex-row"
                position="sticky"
            >
                <div className="grow">&nbsp;</div>
                <Button
                    onClick={handleClose}
                    startIcon={<IoCloseCircle />}
                    variant="contained"
                    color="error"
                >
                    Close
                </Button>
            </AppBar>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, Keyboard]}
                slidesPerView={1}
                navigation
                pagination={{
                    type: "bullets",
                    clickable: true,
                }}
                scrollbar={{
                    draggable: true,
                }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log("slide change")}
                className="w-[100vw]"
                centeredSlides
                grabCursor
                keyboard={{
                    enabled: true,
                }}
                defaultValue={3}
                initialSlide={Number(showImageModal || 0)}
            >
                {images.map((src, i) => (
                    <SwiperSlide key={i} className="object-contain">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt={src}
                            className="w-full h-full object-contain"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Dialog>
    );
}
