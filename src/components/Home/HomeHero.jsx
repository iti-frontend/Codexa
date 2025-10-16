import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";

const HomeHero = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-8 bg-gradient-to-b from-primary/5 to-background"
      id=""
    >
      <div className="text-center max-w-3xl">
        <Badge
          variant="secondary"
          className="rounded-full py-1 border-border"
          asChild
        >
          <Link href="#">Your Journey Starts Here</Link>
        </Badge>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-bold">
          unlock your potential with Codexa
        </h1>
        <p className="mt-6 md:text-lg">
          Join a vibrant community of learners and educators. Explore courses,
          share knowledge, and grow together in a calm and elegant learning
          environment.
        </p>
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <Button size="lg" className="rounded-full text-base">
            Get Started <ArrowUpRight className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base shadow-none"
          >
            <CirclePlay className="size-5" />
            Explore Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
