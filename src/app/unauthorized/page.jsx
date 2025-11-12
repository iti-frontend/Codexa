"use client";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <motion.h1
                className="text-8xl font-bold mb-4 flex gap-2"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                4<motion.span
                    className="text-primary/80"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                >
                    0
                </motion.span>1
            </motion.h1>

            <motion.p
                className="text-lg text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                You don’t have permission to access this page.
            </motion.p>
            <motion.a
                href="/"
                className="mt-6 px-6 py-3 bg-primary/40 hover:bg-primary/20 rounded-2xl shadow-lg transition"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
            >
                Go Home
            </motion.a>
        </div>
    );
}
