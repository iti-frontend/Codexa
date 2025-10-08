import React from "react";
import coursesImg from "../../assets/Home_Images/courses.jpg";
import { Award, Rocket, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
function DescriptionCourses() {
  const coursesList = [
    {
      icon: Rocket,
      title: "1000+ Quality Courses",
      desc: "From beginner to advanced, taught by industry experts",
    },
    {
      icon: Award,
      title: "Skills & Certifications",
      desc: "Earn recognized badges and certificates",
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      desc: "Detailed analytics and personalized learning paths",
    },
  ];

  return (
    <section id="courses" className="py-14">
      <div className="container mx-auto p-6 w-[90%]  lg:w-full">
        <div className="text-center  mx-auto">
          <h2 className="text-3xl font-bold">
            Master New Skills with{" "}
            <span className="text-primary">Expert-Led Courses</span>
          </h2>
          <p className="text-muted-foreground py-4">
            Access a comprehensive library of courses across various
            disciplines. Learn at your own pace, track your progress, and earn
            badges that showcase your expertise.
          </p>
        </div>
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-4 items-center py-4">
          <div>
            <div>
              <ul className="list-none py-2 flex flex-col gap-3 ">
                {coursesList.map((course) => (
                  <li key={course.title} className="flex py-2">
                    <div className="bg-primary text-white h-fit p-2 me-2 rounded-xl hover:bg-primary/20 hover:text-muted-foreground transition-all duration-200">
                      <course.icon />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-medium">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground ">{course.desc}</p>
                    </div>
                  </li>
                ))}
                <li className="py-2">
                  <Button className="mt-2 text-xl text-primary bg-white hover:bg-white text-[20px] border border-primary hover:scale-102 transition-all">
                    Start Learning Free
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          <div className="rounded-[12px] overflow-hidden order-first lg:order-none transition-transform duration-150">
            <img
              src={coursesImg}
              alt="courses image"
              className="h-full object-fill hover:scale-101"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default DescriptionCourses;
