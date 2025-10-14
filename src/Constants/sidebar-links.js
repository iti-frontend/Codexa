"use client";
import { ChartLine, Home, Users, Video } from "lucide-react";

const ins = "/Instructor";
export const InstructorLinks = [
  { icon: Home, name: "Home", href: `${ins}Dashboard` },
  { icon: Video, name: "Courses", href: `${ins}Courses` },
  { icon: ChartLine, name: "Analytics", href: `${ins}Analytics` },
  { icon: Users, name: "Community", href: "/community" },
];
