"use client";
import { ActiveCourses } from "@/Constants/InstructorContent";
import React from "react";
import { Button } from "../ui/button";

function InstructorsActivity() {
    return (
        <div className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full ">
            <h2 className="text-lg font-semibold mb-4">Active Courses</h2>
            <div className="flex flex-col gap-3">
                {ActiveCourses.map((course, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center rounded-xl bg-background/60 p-4 border border-border hover:shadow-md transition"
                    >

                        <div className="flex gap-3 items-center">
                            <img
                                src='https://static.vecteezy.com/system/resources/previews/024/914/580/non_2x/course-icon-vector.jpg'
                                alt={course.TextContent.title}
                                className="w-12 h-12 object-cover rounded-lg"
                            />

                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-bold text-foreground">
                                    {course.TextContent.title}
                                </h3>
                                <p className="text-sm text-foreground/60">{course.TextContent.num}</p>
                            </div>
                        </div>


                        <Button className="rounded-xl bg-primary/80 text-cyan-200">Manage</Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InstructorsActivity;
