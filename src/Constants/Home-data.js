import {
  Home,
  BookOpen,
  Info,
  GraduationCap,
  Users,
  Share2,
} from "lucide-react";

export const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "About", href: "/about", icon: Info },
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
