"use client";

import {
  Award,
  Bell,
  Bookmark,
  ChartLine,
  CheckCircleIcon,
  Grid2x2X,
  Home,
  ShoppingCart,
  Users,
  Video,
  BarChart3,
  UserCheck,
  Settings
} from "lucide-react";

// Instructor Info
export const instructorInfo = [
  {
    avatarSrc: "",
    avatarFallback: "IN",
    h5Text: "Codexa",
    role: "Instructor",
  },
];

// Student Info
export const studentInfo = [
  {
    avatarSrc: "",
    avatarFallback: "ST",
    name: "Mazen",
    role: "Student",
  },
];

// Admin Info
export const adminInfo = [
  {
    avatarSrc: "",
    avatarFallback: "AD",
    name: "Admin",
    role: "Administrator",
  },
];


//  Instructor SideBar Links
const ins = "/instructor";

export const InstructorLinks = [
  { icon: Home, name: "Home", href: `${ins}` },
  { icon: Video, name: "Courses", href: `${ins}/courses` },
  { icon: ChartLine, name: "Analytics", href: `${ins}/analytics` },
  { icon: CheckCircleIcon, name: "Todos", href: "/todo" },
  { icon: Users, name: "Community", href: "/community" },
];


//  Student SideBar Links

const stu = "/student";

export const StudentsLinks = [
  { icon: Home, name: "Home", href: `${stu}` },
  { icon: Video, name: "My Courses", href: `${stu}/courses` },
  { icon: Grid2x2X, name: "Explore More", href: `${stu}/explore` },
  { icon: Award, name: "Certifications", href: `${stu}/certifications` },
  { icon: Users, name: "Community", href: "/community" },
  { icon: CheckCircleIcon, name: "Todos", href: "/todo" },
  { icon: ShoppingCart, name: "Cart", href: `/cart` }
];

//  Admin SideBar Links
const adm = "/admin";

export const AdminLinks = [
  { icon: Home, name: "Dashboard", href: `${adm}` },
  { icon: Users, name: "Students", href: `${adm}/students` },
  { icon: UserCheck, name: "Instructors", href: `${adm}/instructors` },
  { icon: Video, name: "Courses", href: `${adm}/courses` },
];

//  Tools SideBar Links
export const ToolsLinks = [
  { icon: Bell, name: "Notification", href: "/notification" },
  { icon: Bookmark, name: "Saved", href: "/saved" },
];
