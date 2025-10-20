import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { HeroData } from "@/Constants/Home-data";
import Link from "next/link";

const HomeHero = () => {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="gap-2 px-4 py-2 rounded-full border"
            >
              <Sparkles className="w-3 h-3" />
              Your Journey Starts Here
            </Badge>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center tracking-tight">
              Unlock your potential with{" "}
              <span className="text-primary">Codexa</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto">
              Join a vibrant community of learners and educators. Explore
              courses, share knowledge, and grow together.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/login">
                Get Started
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <a href="#courses">
                <CirclePlay className="w-4 h-4" />
                Explore Courses
              </a>
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid sm:grid-cols-3 gap-8 pt-8">
            {HeroData.map((item, index) => (
              <HeroCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;

function HeroCard({ icon: Icon, title, description }) {
  return (
    <Card className="max-w-sm gap-2 shadow-lg rounded-2xl justify-center">
      <CardHeader className="">
        <div className="bg-primary/5 p-2 w-fit rounded-full shadow border border-border">
          <Icon size={20} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <h3 className="text-xl font-bold text-primary/80">{title}</h3>
        <p className="text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
    </Card>
  );
}
