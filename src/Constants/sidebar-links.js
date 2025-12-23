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
  Settings,
  Radio
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

// Instructor SideBar Links 
export const getInstructorLinks = (lang = 'en') => {
  const ins = `/${lang}/instructor`;
  return [
    { icon: Home, nameKey: "home", href: `${ins}` },
    { icon: Video, nameKey: "courses", href: `${ins}/courses` },
    { icon: CheckCircleIcon, nameKey: "todos", href: `/${lang}/todo` },
    { icon: Users, nameKey: "community", href: `/${lang}/community` },
    { icon: Radio, nameKey: "liveSessions", href: `/${lang}/live-sessions/instructor` },
  ];
};

// Student SideBar Links 
export const getStudentsLinks = (lang = 'en') => {
  const stu = `/${lang}/student`;
  return [
    { icon: Home, nameKey: "home", href: `${stu}` },
    { icon: Video, nameKey: "myCourses", href: `${stu}/courses` },
    { icon: Grid2x2X, nameKey: "exploreMore", href: `${stu}/explore` },
    { icon: Users, nameKey: "community", href: `/${lang}/community` },
    { icon: Radio, nameKey: "liveSessions", href: `/${lang}/live-sessions` },
    { icon: CheckCircleIcon, nameKey: "todos", href: `/${lang}/todo` },
    { icon: Bookmark, nameKey: "saved", href: `/${lang}/saved` },
    { icon: ShoppingCart, nameKey: "cart", href: `/${lang}/cart` }
  ];
};

// Admin SideBar Links 
export const getAdminLinks = (lang = 'en') => {
  const adm = `/${lang}/admin`;
  return [
    { icon: Home, nameKey: "dashboard", href: `${adm}` },
    { icon: Users, nameKey: "students", href: `${adm}/students` },
    { icon: UserCheck, nameKey: "instructors", href: `${adm}/instructors` },
    { icon: Video, nameKey: "courses", href: `${adm}/courses` },
  ];
};

// Tools SideBar Links
// export const getToolsLinks = (lang = 'en') => [
//   { icon: Bookmark, nameKey: "saved", href: `/${lang}/saved` },
// ];
export const InstructorLinks = getInstructorLinks('en');
export const StudentsLinks = getStudentsLinks('en');
export const AdminLinks = getAdminLinks('en');
// export const ToolsLinks = getToolsLinks('en');