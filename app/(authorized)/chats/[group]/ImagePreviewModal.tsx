import { AppBar, Button, Dialog, Toolbar } from "@mui/material";
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
            <AppBar position="sticky">
                <Toolbar>
                    <div className="grow"></div>
                    <Button
                        onClick={handleClose}
                        startIcon={<IoCloseCircle />}
                        variant="contained"
                        color="error"
                    >
                        Close
                    </Button>
                </Toolbar>
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
