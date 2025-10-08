import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  BookOpen,
  MessageSquareMore,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
function About() {
  const illustrationList = [
    {
      icon: BookOpen,
      title: "Quality Learning",
      desc: "Access thousands of courses taught by industry experts and passionate educators.",
    },
    {
      icon: Users,
      title: "Vibrant Community",
      desc: "Connect with learners worldwide, share knowledge, and grow together.",
    },
    {
      icon: MessageSquareMore,
      title: "Interactive Discussions",
      desc: "Engage in meaningful conversations through posts, comments, and blog articles.",
    },
    {
      icon: Award,
      title: "Skills & Badges",
      desc: "Showcase your achievements and make yourself visible to potential employers.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      desc: "Monitor your learning journey with detailed analytics and milestones.",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      desc: "Your data and privacy are protected with enterprise-grade security.",
    },
  ];
  return (
    <section id="about" className="py-14">
      <div className="container mx-auto p-6 w-[90%]  lg:w-full">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground py-4">
            Our platform combines learning, networking, and career opportunities
            in one seamless experience.
          </p>
        </div>
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 py-4 ">
          {illustrationList.map((ele) => (
            <Card
              key={ele.name}
              className="border border-gray-300  hover:scale-103 transition-all text-center md:text-start "
            >
              <CardHeader className="flex flex-col items-center md:items-start">
                <div className=" bg-primary p-2 text-white text-2xl w-max rounded-xl hover:bg-primary/20 hover:text-muted-foreground transition-all duration-200">
                  <ele.icon />
                </div>
                <CardTitle className="font-medium">{ele.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{ele.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
