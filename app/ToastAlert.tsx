"use client";

import { useToastAlert } from "@/contexts/ToastAlertContext";
import { computeSeverityMessage } from "@/lib/utils";
import { Alert, Slide, SlideProps, Snackbar } from "@mui/material";

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="down" />;
}

export default function ToastAlert() {
    const { message, setMessage } = useToastAlert();
    const handleClose = () => {
        setMessage("");
    };
    return (
        <Snackbar
            open={!!message}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            TransitionComponent={SlideTransition}
            autoHideDuration={5000}
        >
            <Alert
                onClose={handleClose}
                severity={computeSeverityMessage(message)}
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
