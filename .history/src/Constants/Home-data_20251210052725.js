import {
  Home,
  BookOpen,
  GraduationCap,
  Users,
  Share2,
  Video,
  MessageSquareMore,
  Target,
} from "lucide-react";

// Navbar
export const navItems = [
  { key: "home", href: "#", icon: Home },
  { key: "community", href: "#community", icon: Users },
  { key: "courses", href: "#courses", icon: Video },
  { key: "testimonials", href: "#testimonials", icon: MessageSquareMore },
];

// Hero Cards
export const heroCardsKeys = ["expertCourses", "community", "trackProgress"];
export const heroIcons = {
  expertCourses: BookOpen,
  community: Users,
  trackProgress: Target,
};

// Features
export const featuresKeys = ["learn", "connect", "share"];
export const featuresIcons = {
  learn: GraduationCap,
  connect: Users,
  share: Share2,
};

// Community Cards
export const communityCardsKeys = ["forums", "studyGroups", "knowledgeSharing"];
export const communityIcons = {
  forums: MessageSquareMore,
  studyGroups: Users,
  knowledgeSharing: Share2,
};

// Stats Section
export const statsKeys = ["students", "courses", "instructors", "completion"];
export const statsIcons = {
  students: Users,
  courses: Video,
  instructors: GraduationCap,
  completion: Target,
};

// Testimonials Section
export const testimonialsKeys = ["first", "second", "third"];

// Courses Section (static example data, can be replaced with API)
export const coursesData = [
  {
    category: "Development",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript.",
    lessons: "12 lessons",
    price: "$49",
  },
  {
    category: "Design",
    title: "UI/UX Design Principles",
    description: "Master the core concepts of user-centric design.",
    lessons: "8 lessons",
    price: "$79",
  },
  {
    category: "Marketing",
    title: "Digital Marketing Essentials",
    description: "Grow your business with modern marketing techniques.",
    lessons: "15 lessons",
    price: "$59",
  },
];

// Footer Links
export const footerSections = ["platform", "resources", "legal"];
export const footerLinks = {
  platform: [
    { key: "about", href: "/about" },
    { key: "how", href: "/how-it-works" },
    { key: "pricing", href: "/pricing" },
    { key: "careers", href: "/careers" },
  ],
  resources: [
    { key: "courses", href: "/courses" },
    { key: "community", href: "/community" },
    { key: "blog", href: "/blog" },
    { key: "help", href: "/help" },
  ],
  legal: [
    { key: "privacy", href: "/privacy" },
    { key: "terms", href: "/terms" },
    { key: "cookies", href: "/cookies" },
  ],
};
