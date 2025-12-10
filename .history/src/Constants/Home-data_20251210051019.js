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
  { label: "home.nav.home", href: "#", icon: Home },
  { label: "home.nav.community", href: "#community", icon: Users },
  { label: "home.nav.courses", href: "#courses", icon: Video },
  {
    label: "home.nav.testimonials",
    href: "#testimonials",
    icon: MessageSquareMore,
  },
];

export const HeroData = [
  {
    icon: BookOpen,
    title: "home.hero.cards.expertCourses.title",
    description: "home.hero.cards.expertCourses.description",
  },
  {
    icon: Users,
    title: "home.hero.cards.community.title",
    description: "home.hero.cards.community.description",
  },
  {
    icon: Target,
    title: "home.hero.cards.trackProgress.title",
    description: "home.hero.cards.trackProgress.description",
  },
];

export const featuresData = [
  {
    icon: GraduationCap,
    title: "home.features.learn.title",
    description: "home.features.learn.description",
  },
  {
    icon: Users,
    title: "home.features.connect.title",
    description: "home.features.connect.description",
  },
  {
    icon: Share2,
    title: "home.features.share.title",
    description: "home.features.share.description",
  },
];
