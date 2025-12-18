"use client";
import React from "react";
import { motion } from "framer-motion";
import { recentActivity } from "@/Constants/InstructorContent";
import { useTranslation } from "react-i18next";
import { Clock, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function RecentActivity() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full mt-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          {t("instructor.recent.title")}
        </h2>
        <Badge variant="secondary">
          {recentActivity.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
        {recentActivity.map((reactive, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="flex items-start gap-3 rounded-xl bg-background/60 p-4 cursor-pointer border border-transparent hover:border-primary/30 transition-all"
          >
            {/* Avatar */}
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarImage 
                src={reactive.imgSrc || "https://static.vecteezy.com/system/resources/previews/036/885/313/non_2x/blue-profile-icon-free-png.png"}
                alt={reactive.name}
              />
              <AvatarFallback>
                <User className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-foreground truncate">
                  {reactive.name}
                </span>
                {reactive.badge && (
                  <Badge variant="outline" className="text-xs">
                    {reactive.badge}
                  </Badge>
                )}
              </div>

              <p className="text-sm text-foreground/80 mb-2">
                {reactive.course
                  ? t(`instructor.recent.actions.${reactive.action}`, { course: reactive.course })
                  : t(`instructor.recent.actions.${reactive.action}`)}
              </p>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{t(`instructor.recent.times.${reactive.time}`)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {recentActivity.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {t("instructor.recent.noActivity")}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default RecentActivity;