"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useStudentCourses } from "@/hooks/useStudentCourses";
import EmptyCourses from "./EmptyCourses";
import Link from "next/link";


export default function ContinueWatching() {
    const { courses, loading } = useStudentCourses();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground mt-3">
                    Loading courses...
                </p>
            </div>
        );
    }
    if (!courses.length) {
        return (
            <EmptyCourses courses={courses} />
        );
    }

    return (
        <section className="w-full mb-3">
            <h2 className="text-xl font-bold  ">Continue <span className="text-primary">Watching</span></h2>

            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full py-4 "
            >
                <CarouselContent className="-ml-2 md:-ml-4 bg-transparent ">
                    {courses.map((course, index) => (
                        <CarouselItem
                            key={index}
                            className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{
                                    scale: 1.03,
                                    transition: { type: "spring", stiffness: 300, damping: 15 },
                                }}
                            >
                                <Card className="h-full shadow-lg rounded-2xl py-0 overflow-hidden transition-transform ">
                                    <Link href={`/student/courses/${course._id}`}>
                                        <CardHeader className="relative w-full h-40 ">
                                            <Image
                                                src="/auth/login.png"
                                                alt=""
                                                fill
                                                className="object-cover"
                                            />
                                        </CardHeader>

                                        <CardContent className="space-y-2  px-4">
                                            <span className="text-primary text-sm block">
                                                {course.TrackName}
                                            </span>
                                            <h3 className="font-semibold text-card-foreground sm:line-clamp-1 text-base line-clamp-2">
                                                {course.title}
                                            </h3>
                                        </CardContent>

                                        <CardFooter className="flex items-center gap-3 py-2 px-3 border border-t-2">
                                            <img
                                                src="https://static.vecteezy.com/system/resources/previews/036/885/313/non_2x/blue-profile-icon-free-png.png"
                                                alt={course.instructor.name}
                                                className="w-9 h-9 rounded-full object-cover"
                                            />
                                            <span className="text-sm text-primary font-medium">
                                                {course.instructor.name}
                                            </span>
                                        </CardFooter>
                                    </Link>

                                </Card>

                            </motion.div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className=" left-1" />
                <CarouselNext className="right-1" />
            </Carousel>

        </section>
    );
}
