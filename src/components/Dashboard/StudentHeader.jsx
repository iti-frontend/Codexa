"use client";
import React from "react";

import { motion } from "framer-motion";
import { Button } from "../ui/button";

function StudentHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-purple-700 p-5 shadow-sm w-full">
            <h2 className="text-xl md:text-3xl font-semibold mb-4 text-white">Welcome to your dashboard</h2>
            <p className="text-white/80">
                Here you can manage your daily tasks efficiently and track your progress
                with ease. Stay focused, organized, and productive by keeping all your
                goals in one place.
            </p>

            <Button className="mt-4 bg-black">Join Now</Button>


        </motion.div>
    )
}

export default StudentHeader