"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const variants = {
    in: {
        opacity: 1,
    },
    center: {
        opacity: 1,
    },
    out: {
        opacity: 0,
    },
};

export default function TransitionEffect({
    children,
}: {
    children: React.ReactElement;
}) {
    const pathname = usePathname();

    return (
        <AnimatePresence initial={false}>
            <motion.div
                transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                }}
                key={pathname}
                variants={variants}
                initial="center"
                animate="in"
                exit="out"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
