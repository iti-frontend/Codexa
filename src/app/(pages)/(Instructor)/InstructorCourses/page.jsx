"use client";
import CreateCourseDialog from "@/components/Dashboard/CreateCourseDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInstructorCourse } from "@/hooks/useInstructorCourse";
import { useCoursesStore } from "@/store/useCoursesStore";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const tabs = [
  {
    name: "Active",
    value: "active",
    content: (
      <>
        <CourseCard
          title="JavaScript"
          desc="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis facere, dolores aliquam non voluptate vero pariatur tempora temporibus dolore, consectetur reprehenderit nostrum in impedit ut voluptates aut molestiae molestias sunt."
        />
        <CourseCard
          title="React"
          desc="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis facere, dolores aliquam non voluptate vero pariatur tempora temporibus dolore, consectetur reprehenderit nostrum in impedit ut voluptates aut molestiae molestias sunt."
        />
      </>
    ),
  },
  {
    name: "Drafts",
    value: "drafts",
    content: (
      <>
        <CourseCard
          title="Node.js"
          desc="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis facere, dolores aliquam non voluptate vero pariatur tempora temporibus dolore, consectetur reprehenderit nostrum in impedit ut voluptates aut molestiae molestias sunt."
        />
      </>
    ),
  },
  {
    name: "Archived",
    value: "archived",
    content: (
      <>
        <CourseCard
          title="TypeScript"
          desc="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis facere, dolores aliquam non voluptate vero pariatur tempora temporibus dolore, consectetur reprehenderit nostrum in impedit ut voluptates aut molestiae molestias sunt."
        />
      </>
    ),
  },
];

function InstructorCourses() {
  const [open, setOpen] = useState(false);
  const { courses } = useCoursesStore();
  const { fetchInstructorCourses } = useInstructorCourse();

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

      {/* Tabs */}
      <Tabs defaultValue="active" className="gap-4 p-0">
        <div className="border-b px-5">
          <TabsList className="bg-background rounded-none p-0 space-x-5">
            <TabsTrigger
              value="active"
              className="data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Active
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="space-y-4 px-3 pb-3 md:px-5">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard
                key={course._id}
                title={course.title}
                desc={course.description}
                price={course.price}
                instructor={course.instructor?.name}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center mt-6">
              No courses found.
            </p>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Course Dialog */}
      <CreateCourseDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
export default InstructorCourses;

function CourseCard({ title, desc, price, instructor }) {
  return (
    <div className="bg-sidebar p-3 rounded-3xl border border-border flex flex-col md:flex-row gap-4">
      <div className="relative w-full md:w-64 md:h-36 lg:w-72 xl:w-80 h-40 shrink-0">
        <Image
          src={"/auth/login.png"}
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
        <Button className="w-fit">Manage Course</Button>
      </div>
    </div>
  );
}
