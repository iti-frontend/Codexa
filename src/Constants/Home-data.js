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

export const navItems = [
  { label: "Home", href: "#", icon: Home },
  { label: "Community", href: "#community", icon: Users },
  { label: "Courses", href: "#courses", icon: Video },
  { label: "Testimonials", href: "#testimonials", icon: MessageSquareMore },
];

export const HeroData = [
  {
    icon: BookOpen,
    title: "Expert Courses",
    description: "Learn from industry professionals.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with fellow learners.",
  },
  {
    icon: Target,
    title: "Track Progress",
    description: "Monitor your learning journey.",
  },
];

export const featuresData = [
  {
    icon: GraduationCap,
    title: "Learn from Experts",
    description:
      "Access high-quality courses taught by industry leaders and experienced educators.",
  },
  {
    icon: Users,
    title: "Connect with Peers",
    description:
      "Engage with a diverse community of learners, share insights, and collaborate on projects.",
  },
  {
    icon: Share2,
    title: "Share Your Knowledge",
    description:
      "Become a teacher and share your expertise with a global audience, earning rewards for your contributions.",
  },
];

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
