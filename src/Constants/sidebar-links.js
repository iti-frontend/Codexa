"use client";
import {  Bell, Bookmark, BookmarkIcon, ChartLine, Grid2x2X, Home, ListChecks, ShoppingCart, Users, Video } from "lucide-react";

// Instructor Info
export const instructorInfo=[{
      avatarSrc:'',
      avatarFallback:'CN',
      h5Text:'Codexa',
      role:'Instructor'
}]

// Student Info
export const studentInfo=[{
      avatarSrc:'',
      avatarFallback:'CN',
      name:'Mazen',
      role:'Student'

}]

// Instructor SideBar
const ins = "/Instructor";
export const InstructorLinks = [
  { icon: Home, name: "Home", href: `${ins}Dashboard` },
  { icon: Video, name: "Courses", href: `${ins}Courses` },
  { icon: ChartLine, name: "Analytics", href: `${ins}Analytics` },
  { icon: Users, name: "Community", href: "/community" },
];

// Student SideBar
const stu = "/Student";
export const StudentsLinks = [
  { icon: Home, name: "Home", href: `${stu}Dashboard` },
  { icon: Video, name: "My Courses", href: `${stu}Courses` },
  { icon: Grid2x2X, name: "Explore More", href: `${stu}Explore` },
  { icon: ListChecks , name: "Tasks", href: `${stu}Tasks` },
  { icon: Users, name: "Community", href: "/community" },
  { icon: BookmarkIcon, name: "Saved", href: "/saved" },
  { icon: ShoppingCart, name: "Cart", href: `${stu}Cart` }
]; 

// SideBar Tools
export const ToolsLinks=[
  {icon:Bell,name:'Notification',href:"/notification"},
  {icon:Bookmark,name:'Saved',href:"/saved"}
]


