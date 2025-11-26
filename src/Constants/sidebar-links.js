"use client";
import { Award, Bell, Bookmark, BookmarkIcon, ChartLine, CheckCircleIcon, CheckIcon, Grid2x2X, Home, ListChecks, ShoppingCart, Users, Video } from "lucide-react";

// Instructor Info
export const instructorInfo = [{
  avatarSrc: '',
  avatarFallback: 'CN',
  h5Text: 'Codexa',
  role: 'Instructor'
}]

// Student Info
export const studentInfo = [{
  avatarSrc: '',
  avatarFallback: 'CN',
  name: 'Mazen',
  role: 'Student'

}]

// Instructor SideBar
const ins = "/instructor";
export const InstructorLinks = [
  { icon: Home, name: "Home", href: `${ins}` },
  { icon: Video, name: "Courses", href: `${ins}/courses` },
  { icon: ChartLine, name: "Analytics", href: `${ins}/analytics` },
  { icon: CheckCircleIcon, name: "Todos", href: "/todo" },
  { icon: Users, name: "Community", href: "/community" },
];

// Student SideBar
const stu = "/student";
export const StudentsLinks = [
  { icon: Home, name: "Home", href: `${stu}` },
  { icon: Video, name: "My Courses", href: `${stu}/courses` },
  { icon: Grid2x2X, name: "Explore More", href: `${stu}/explore` },
  { icon: Award, name: "Certifications", href: `${stu}/certifications` },
  { icon: Users, name: "Community", href: "/community" },
  { icon: CheckCircleIcon, name: "Todos", href: "/todo" },
  { icon: ShoppingCart, name: "Cart", href: `${stu}/cart` }
];

// SideBar Tools
export const ToolsLinks = [
  { icon: Bell, name: 'Notification', href: "/notification" },
  { icon: Bookmark, name: 'Saved', href: "/saved" }
]


