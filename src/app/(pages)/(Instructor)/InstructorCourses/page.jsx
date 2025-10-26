"use client";
import CreateCourseDialog from "@/components/Dashboard/CreateCourseDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
  return (
    <>
      {/* Courses Header */}
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

      {/* Tab List */}
      <Tabs defaultValue="active" className="gap-4 p-0">
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
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog */}
      <CreateCourseDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
export default InstructorCourses;

function CourseCard({ title, desc }) {
  return (
    <div className="bg-sidebar p-3 rounded-3xl border border-border flex flex-col md:flex-row gap-4">
      {/* Course Image */}
      <div className="relative w-full md:w-64 md:h-36 lg:w-72 xl:w-80 h-40 shrink-0">
        <Image
          src={"/auth/login.png"}
          alt=""
          fill
          className="rounded-md object-cover"
        />
      </div>

      {/* Course Details */}
      <div className="flex flex-col gap-4 md:gap-0 justify-between max-w-lg">
        <div className="space-y-2">
          <h4 className="font-bold text-lg md:text-2xl">{title}</h4>
          <p className="text-foreground/70 text-sm line-clamp-2">{desc}</p>
        </div>
        <Button className={"w-fit"}>Manage Course</Button>
      </div>
    </div>
  );
}
