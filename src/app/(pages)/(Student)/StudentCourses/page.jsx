import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

const tabs = [
    {
        name: "Completed",
        value: "completed",
        content: (
            <>
                <CourseCard
                    title="The Ultimate React Course 2025"
                    desc="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis facere, dolores aliquam non voluptate vero pariatur tempora temporibus dolore, consectetur reprehenderit nostrum in impedit ut voluptates aut molestiae molestias sunt."
                />
                <CourseCard
                    title="The Complete Full-Stack Web Development Bootcamp"
                    desc="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis facere, dolores aliquam non voluptate vero pariatur tempora temporibus dolore, consectetur reprehenderit nostrum in impedit ut voluptates aut molestiae molestias sunt."
                />
            </>
        ),
    },
    {
        name: "Continue Watching",
        value: "continue-watching",
        content: (
            <>
                <CourseCard
                    title="NodeJs-The Complete Guide(MVC,Rest,APIs,GraphQl)"
                    desc="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis facere, dolores aliquam non voluptate vero pariatur tempora temporibus dolore, consectetur reprehenderit nostrum in impedit ut voluptates aut molestiae molestias sunt."
                />
            </>
        ),
    },
    {
        name: "Not Started",
        value: "not-started",
        content: (
            <>
                <CourseCard
                    title="The Ultimate React Course 2025"
                    desc="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis facere, dolores aliquam non voluptate vero pariatur tempora temporibus dolore, consectetur reprehenderit nostrum in impedit ut voluptates aut molestiae molestias sunt."
                />
            </>
        ),
    },
];

function StudentCourses() {
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

            </header>

            {/* Tab List */}
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
                        {tab.content}
                    </TabsContent>
                ))}
            </Tabs>
        </>
    );
}
export default StudentCourses;

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
                    <p className="text-foreground/70 text-sm line-clamp-2 mb-3">{desc}</p>
                </div>
                <Button className={"w-fit"}>Manage Course</Button>
            </div>
        </div>
    );
}
