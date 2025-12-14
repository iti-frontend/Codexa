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
  { label: "Home", href: "#", icon: Home, translationKey: "home" },
  { label: "Community", href: "#community", icon: Users, translationKey: "community" },
  { label: "Courses", href: "#courses", icon: Video, translationKey: "courses" },
  { label: "Testimonials", href: "#testimonials", icon: MessageSquareMore, translationKey: "testimonials" },
];

export const HeroData = [
  {
    icon: BookOpen,
    title: "Expert Courses",
    description: "Learn from industry professionals.",
    translationKey: "expertCourses"
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with fellow learners.",
    translationKey: "community"
  },
  {
    icon: Target,
    title: "Track Progress",
    description: "Monitor your learning journey.",
    translationKey: "trackProgress"
  },
];

export const featuresData = [
  {
    icon: GraduationCap,
    title: "Learn from Experts",
    description:
      "Access high-quality courses taught by industry leaders and experienced educators.",
    translationKey: "learn"
  },
  {
    icon: Users,
    title: "Connect with Peers",
    description:
      "Engage with a diverse community of learners, share insights, and collaborate on projects.",
    translationKey: "connect"
  },
  {
    icon: Share2,
    title: "Share Your Knowledge",
    description:
      "Become a teacher and share your expertise with a global audience, earning rewards for your contributions.",
    translationKey: "share"
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
    title: "Discussion Forums",
    description:
      "Engage in meaningful conversations with peers and instructors on various topics.",
    translationKey: "forums"
  },
  {
    icon: Users,
    title: "Study Groups",
    description:
      "Join or create study groups to collaborate and learn together with fellow students.",
    translationKey: "studyGroups"
  },
  {
    icon: Share2,
    title: "Knowledge Sharing",
    description:
      "Share your insights, ask questions, and help others in their learning journey.",
    translationKey: "knowledgeSharing"
  },
];

export const statsData = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Students",
    translationKey: "students"
  },
  {
    icon: Video,
    value: "500+",
    label: "Quality Courses",
    translationKey: "courses"
  },
  {
    icon: GraduationCap,
    value: "200+",
    label: "Expert Instructors",
    translationKey: "instructors"
  },
  {
    icon: Target,
    value: "95%",
    label: "Completion Rate",
    translationKey: "completion"
  },
];

export const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Web Developer",
    image: "",
    rating: 5,
    quote:
      "Codexa transformed my career. The courses are comprehensive and the community support is incredible!",
    translationKey: "first"
  },
  {
    name: "Michael Chen",
    role: "UX Designer",
    image: "",
    rating: 5,
    quote:
      "The best e-learning platform I've used. The instructors are knowledgeable and the content is always up-to-date.",
    translationKey: "second"
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Specialist",
    image: "",
    rating: 5,
    quote:
      "I love the community aspect of Codexa. It's not just about learning, it's about growing together.",
    translationKey: "third"
  },
];

export const footerLinks = {
  platform: [
    { label: "About Us", href: "/about", translationKey: "about" },
    { label: "How It Works", href: "/how-it-works", translationKey: "how" },
    { label: "Pricing", href: "/pricing", translationKey: "pricing" },
    { label: "Careers", href: "/careers", translationKey: "careers" },
  ],
  resources: [
    { label: "All Courses", href: "/courses", translationKey: "courses" },
    { label: "Community", href: "/community", translationKey: "community" },
    { label: "Blog", href: "/blog", translationKey: "blog" },
    { label: "Help Center", href: "/help", translationKey: "help" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy", translationKey: "privacy" },
    { label: "Terms of Service", href: "/terms", translationKey: "terms" },
    { label: "Cookie Policy", href: "/cookies", translationKey: "cookies" },
  ],
};