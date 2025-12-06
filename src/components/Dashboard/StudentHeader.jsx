"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

function StudentHeader() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-purple-700 p-5 shadow-sm w-full"
        >
            <h2 className="text-xl md:text-3xl font-semibold mb-4 text-white">
                {t("dashboard.header.welcome")}
            </h2>
            <p className="text-white/80">
                {t("dashboard.header.description")}
            </p>

            <Button className="mt-4 bg-black">
                {t("dashboard.header.joinNow")}
            </Button>
        </motion.div>
    );
}

export default StudentHeader;