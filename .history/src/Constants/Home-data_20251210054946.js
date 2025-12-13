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
  { label: "home", href: "#", icon: Home },
  { label: "community", href: "#community", icon: Users },
  { label: "courses", href: "#courses", icon: Video },
  { label: "testimonials", href: "#testimonials", icon: MessageSquareMore },
];

export const HeroData = [
  {
    icon: BookOpen,
    titleKey: "home.hero.cards.expertCourses.title",
    descriptionKey: "home.hero.cards.expertCourses.description",
  },
  {
    icon: Users,
    titleKey: "home.hero.cards.community.title",
    descriptionKey: "home.hero.cards.community.description",
  },
  {
    icon: Target,
    titleKey: "home.hero.cards.trackProgress.title",
    descriptionKey: "home.hero.cards.trackProgress.description",
  },
];

export const featuresData = [
  {
    icon: GraduationCap,
    titleKey: "home.features.learn.title",
    descriptionKey: "home.features.learn.description",
  },
  {
    icon: Users,
    titleKey: "home.features.connect.title",
    descriptionKey: "home.features.connect.description",
  },
  {
    icon: Share2,
    titleKey: "home.features.share.title",
    descriptionKey: "home.features.share.description",
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

export const communityData = [
  {
    icon: MessageSquareMore,
    titleKey: "home.community.forums.title",
    descriptionKey: "home.community.forums.description",
  },
  {
    icon: Users,
    titleKey: "home.community.studyGroups.title",
    descriptionKey: "home.community.studyGroups.description",
  },
  {
    icon: Share2,
    titleKey: "home.community.knowledgeSharing.title",
    descriptionKey: "home.community.knowledgeSharing.description",
  },
];

export const statsData = [
  {
    icon: Users,
    value: "50,000+",
    labelKey: "home.stats.students",
  },
  {
    icon: Video,
    value: "500+",
    labelKey: "home.stats.courses",
  },
  {
    icon: GraduationCap,
    value: "200+",
    labelKey: "home.stats.instructors",
  },
  {
    icon: Target,
    value: "95%",
    labelKey: "home.stats.completion",
  },
];

export const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Web Developer",
    image: "",
    rating: 5,
    quoteKey: "home.testimonials.first",
  },
  {
    name: "Michael Chen",
    role: "UX Designer",
    image: "",
    rating: 5,
    quoteKey: "home.testimonials.second",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Specialist",
    image: "",
    rating: 5,
    quoteKey: "home.testimonials.third",
  },
];

export const footerLinks = {
  platform: [
    { labelKey: "home.footer.about", href: "/about" },
    { labelKey: "home.footer.how", href: "/how-it-works" },
    { labelKey: "home.footer.pricing", href: "/pricing" },
    { labelKey: "home.footer.careers", href: "/careers" },
  ],
  resources: [
    { labelKey: "home.footer.blog", href: "/courses" },
    { labelKey: "home.footer.help", href: "/community" },
    { labelKey: "home.footer.blog", href: "/blog" },
    { labelKey: "home.footer.help", href: "/help" },
  ],
  legal: [
    { labelKey: "home.footer.privacy", href: "/privacy" },
    { labelKey: "home.footer.terms", href: "/terms" },
    { labelKey: "home.footer.cookies", href: "/cookies" },
  ],
};