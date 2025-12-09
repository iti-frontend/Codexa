"use client";
import React from "react";
import { motion } from "framer-motion";
import { recentActivity } from "@/Constants/InstructorContent";
import { useTranslation } from "react-i18next";

function RecentActivity() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full mt-4"
    >
      <h2 className="text-lg font-semibold mb-4">
        {t("instructor.recent.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
        {recentActivity.map((reactive, index) => (
          <motion.div
            key={index}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="flex flex-col items-start xl:items-center gap-3 rounded-xl bg-background/60 p-4 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <img
                src="https://static.vecteezy.com/system/resources/previews/036/885/313/non_2x/blue-profile-icon-free-png.png"
                alt={reactive.name}
                className="w-12 h-12 object-cover rounded-full"
              />
              <span className="font-bold text-foreground">
                {reactive.name}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-foreground/80">
                {reactive.course
                  ? t(reactive.text, { course: reactive.course })
                  : t(reactive.text)}
              </p>

              <span className="text-sm text-foreground/60">
                {t(reactive.time)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default RecentActivity;
