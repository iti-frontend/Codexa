"use client";
import CreateCourseDialog from "@/components/Dashboard/CreateCourseDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInstructorCourse } from "@/hooks/useInstructorCourse";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function InstructorCourses() {
  const [open, setOpen] = useState(false);
  const { fetchInstructorCourses, courses } = useInstructorCourse();

  useEffect(() => {
    fetchInstructorCourses();
  }, []);
  return (
    <>
      <header className="flex items-start justify-between p-5">
        <div>
          <h1 className="text-xl lg:text-3xl font-bold mb-1">My Courses</h1>
          <h5 className="text-muted-foreground text-xs md:text-base">
            Manage and organize your courses
          </h5>
        </div>

        <Button
          className="text-xs md:text-base flex items-center gap-2"
          onClick={() => setOpen(true)}
        >
          <Plus size={16} /> New Course
        </Button>
      </header>

      {/* Courses */}
      <div className="p-5 space-y-3">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course._id}
              title={course.title}
              id={course._id}
              desc={course.description}
              price={course.price}
              instructor={course.instructor?.name}
              coverImage={course.coverImage}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-center mt-6">
            No courses found.
          </p>
        )}
      </div>

      {/* Create Course Dialog */}
      <CreateCourseDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
export default InstructorCourses;

function CourseCard({ id, title, desc, price, instructor, coverImage }) {
  return (
    <div className="bg-sidebar p-3 rounded-3xl border border-border flex flex-col md:flex-row gap-4">
      <div className="relative w-full md:w-64 md:h-36 lg:w-72 xl:w-80 h-40 shrink-0">
        <Image
          src={
            coverImage.url ||
            "https://static.vecteezy.com/system/resources/previews/024/914/580/non_2x/course-icon-vector.jpg"
          }
          alt="course thumbnail"
          fill
          className="rounded-md object-cover"
        />
      </div>

      <div className="flex flex-col gap-4 md:gap-0 justify-between max-w-lg">
        <div className="space-y-1">
          <h4 className="font-bold text-lg md:text-2xl">{title}</h4>
          <p className="text-foreground/70 text-sm line-clamp-2">{desc}</p>
          <p className="text-sm text-muted-foreground">
            Instructor: {instructor || "Unknown"}
          </p>
          <p className="font-semibold">${price}</p>
        </div>

        <Button asChild className="w-fit">
          <Link href={`/instructor/courses/${id}`}>Manage Course</Link>
        </Button>
      </div>
    </div>
  );
}
