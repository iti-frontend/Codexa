"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useInstructorCourse } from "@/hooks/useInstructorCourse";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { OptimizedImg } from "@/components/ui/optimized-image";

function InstructorsActivity() {
  const { t } = useTranslation();
  const { fetchInstructorCourses, courses } = useInstructorCourse();

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 1000 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full"
    >
      <h2 className="text-lg font-semibold mb-4">
        {t("instructor.activity.title")}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {courses.map((course, index) => (
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
                <OptimizedImg
                  src={
                    course.coverImage.url ??
                    "https://static.vecteezy.com/system/resources/previews/024/914/580/non_2x/course-icon-vector.jpg"
                  }
                  alt={course.title}
                  fallbackSrc="https://static.vecteezy.com/system/resources/previews/024/914/580/non_2x/course-icon-vector.jpg"
                  containerClassName="w-14 h-14 rounded-xl overflow-hidden border border-border shadow-sm shrink-0"
                  className="w-full h-full object-cover"
                />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background" />
              </div>

              <div className="flex flex-col">
                <h3 className="text-sm sm:text-lg font-semibold text-foreground">
                  {course.title}
                </h3>
                <p className="text-sm text-foreground/60 mt-0.5">
                  {course.description}
                </p>
              </div>
            </div>

            <Button asChild className="w-fit">
              <Link href={`/instructor/courses/${course._id}`}>
                {t("instructor.activity.manage")}
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default InstructorsActivity;
