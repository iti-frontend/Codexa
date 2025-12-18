"use client";
import React from "react";
import { motion } from "framer-motion";
import { followingUsers } from "@/Constants/StudentContent";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

function FollowingUsers() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full"
        >
            <h2 className="text-lg font-semibold mb-4">{t("dashboard.following.title")}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-4">
                {followingUsers.map((user, index) => (
                    <motion.div
                        key={index}
                        whileHover={{
                            scale: 1.03,
                            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                        }}
                        className="flex justify-between items-center rounded-xl bg-background/60 p-4 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/036/885/313/non_2x/blue-profile-icon-free-png.png"
                                alt={user.name}
                                className="w-12 h-12 lg:w-12 lg:h-12 object-cover rounded-full"
                            />
                            <div className="flex flex-col gap-1">
                                <p className="font-bold text-foreground">{user.name}</p>
                                <p className="text-foreground/80 text-sm">{t("dashboard.following.mentor")}</p>
                            </div>
                        </div>

                        <Button>
                            <UserPlus />
                            {t("dashboard.following.follow")}
                        </Button>
                    </motion.div>
                ))}
            </div>
            <Button className='mt-3 w-full font-bold'>
                {t("dashboard.following.seeAll")}
            </Button>
        </motion.div>
    );
}

export default FollowingUsers;