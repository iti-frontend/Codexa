import { coursesData } from "@/Constants/Home-data";
import HomeHeading from "./HomeHeading";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

function HomeCourses() {
  return (
    <section
      className="flex flex-col items-center justify-center py-10 bg-background"
      id="courses"
    >
      <HomeHeading
        title={"Featured Courses"}
        desc={
          "Explore our most popular courses to get started on your learning journey."
        }
      />
      <main className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-8 mt-5">
        {coursesData.map((course, index) => (
          <CoursesCard
            key={index}
            category={course.category}
            lessons={course.lessons}
            price={course.price}
            title={course.title}
            description={course.description}
          />
        ))}
      </main>
      <footer className="mt-5">
        <Button
          variant={"secondary"}
          className={"text-primary border-2 border-primary"}
          size={"lg"}
          asChild
        >
          <Link href="/InstructorCourses">View all Courses</Link>
        </Button>
      </footer>
    </section>
  );
}
export default HomeCourses;

function CoursesCard({ category, title, description, lessons, price }) {
  return (
    <Card className="max-w-xs gap-2 shadow-lg rounded-2xl pt-0 overflow-hidden">
      <CardHeader className="relative w-full h-48">
        <Image src="/auth/login.png" alt="" fill className="object-cover" />
      </CardHeader>
      <CardContent className="space-y-3 pt-3">
        <span className="text-primary block">{category}</span>
        <h3 className="text-xl font-bold text-card-foreground line-clamp-1">
          {title}
        </h3>
        <p className="text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className={"justify-between"}>
        <span className="text-foreground/70 text-sm">{lessons}</span>
        <span className="text-primary">{price}</span>
      </CardFooter>
    </Card>
  );
}
