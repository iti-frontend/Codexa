"use client";
import { ActiveCourses } from "@/Constants/InstructorContent";
import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

function InstructorsActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 1000 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full"
    >
      <h2 className="text-lg font-semibold mb-4">Active Courses</h2>

      <div className="grid grid-cols-1 gap-4">
        {ActiveCourses.map((course, index) => (
          <motion.div
            key={index}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="flex flex-col sm:flex-row justify-between items-center rounded-xl 
                        bg-background/60 p-5 border border-border 
                        hover:border-primary/50 cursor-pointer hover:bg-background/80  gap-4"
          >
            <div className="flex gap-4 items-start w-full sm:w-auto">
              <div className="relative shrink-0">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/024/914/580/non_2x/course-icon-vector.jpg"
                  alt={course.TextContent.title}
                  className="w-14 h-14 object-cover rounded-xl border border-border shadow-sm shrink-0"
                />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background" />
              </div>

              <div className="flex flex-col">
                <h3 className="text-sm sm:text-lg font-semibold text-foreground">
                  {course.TextContent.title}
                </h3>
                <p className="text-sm text-foreground/60 mt-0.5">
                  {course.TextContent.num}
                </p>
              </div>
            </div>

            <Button className="">Manage</Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default InstructorsActivity;
