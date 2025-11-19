"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import { useAuthStore } from "@/store/useAuthStore";
import { useStudentCourses } from "@/hooks/useStudentCourses";
import EmptyCourses from "@/components/Dashboard/EmptyCourses";

function StudentCourses() {
    const { courses, loading } = useStudentCourses();

    // ------------------------------
    // Filters
    // ------------------------------
    const allCourses = courses
    const completed = courses.filter((c) => c.progress === 100);
    const inProgress = courses.filter((c) => c.progress > 0 && c.progress < 100);
    const notStarted = courses.filter((c) => c.progress === 0);

    const tabs = [
        { name: "All Courses", value: "all-courses", list: allCourses },
        { name: "Completed", value: "completed", list: completed },
        { name: "Continue Watching", value: "continue-watching", list: inProgress },
        { name: "Not Started", value: "not-started", list: notStarted },
    ];

    // ------------------------------
    // Loading State
    // ------------------------------
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-10">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground text-sm mt-2">Loading courses...</p>
            </div>
        );
    }

    // ------------------------------
    // Component Render
    // ------------------------------
    return (
        <>
            {/* Header */}
            <header className="flex items-start justify-between p-5">
                <div>
                    <h1 className="text-xl lg:text-3xl font-bold mb-1">My Courses</h1>
                    <h5 className="text-muted-foreground text-xs md:text-base">
                        Manage and organize your courses
                    </h5>
                </div>
            </header>

            {/* Tabs */}
            <Tabs defaultValue="completed" className="gap-4 p-0">
                <div className="border-b px-5">
                    <TabsList className="bg-background rounded-none p-0 space-x-5">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="data-[state=active]:dark:bg-background data-[state=active]:text-primary data-[state=active]:dark:text-primary data-[state=active]:border-primary p-0 dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
                            >
                                {tab.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Tab Content */}
                {tabs.map((tab) => (
                    <TabsContent
                        key={tab.value}
                        value={tab.value}
                        className="space-y-4 px-3 pb-3 md:px-5"
                    >
                        {tab.list.length === 0 ? (
                            <EmptyCourses courses={tab.list} message={`No ${tab.name} courses found.`} />
                        ) : (
                            tab.list.map((course) => (
                                <CourseCard
                                    key={course._id}
                                    title={course.title}
                                    desc={course.description}
                                    image={course.coverImage?.url}
                                />
                            ))
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </>
    );
}
function CourseCard({ title, desc, image }) {
    return (
        <div className="bg-sidebar p-3 rounded-3xl border border-border flex flex-col md:flex-row gap-4">
            {/* Image */}
            <div className="relative w-full md:w-64 md:h-36 lg:w-72 xl:w-80 h-40 shrink-0">
                <Image
                    src={image || "/auth/login.png"}
                    alt=""
                    fill
                    className="rounded-md object-cover"
                />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4 md:gap-0 justify-between max-w-lg">
                <div className="space-y-2">
                    <h4 className="font-bold text-lg md:text-2xl">{title}</h4>
                    <p className="text-foreground/70 text-sm line-clamp-2 mb-3">{desc}</p>
                </div>
                <Button className="w-fit">Manage Course</Button>
            </div>
        </div>
    );
}
export default StudentCourses;
