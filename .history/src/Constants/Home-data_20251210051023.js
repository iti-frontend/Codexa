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

export const communityData = [
  {
    icon: MessageSquareMore,
    title: "Discussion Forums",
    description:
      "Engage in meaningful conversations with peers and instructors on various topics.",
  },
  {
    icon: Users,
    title: "Study Groups",
    description:
      "Join or create study groups to collaborate and learn together with fellow students.",
  },
  {
    icon: Share2,
    title: "Knowledge Sharing",
    description:
      "Share your insights, ask questions, and help others in their learning journey.",
  },
];

export const statsData = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Students",
  },
  {
    icon: Video,
    value: "500+",
    label: "Quality Courses",
  },
  {
    icon: GraduationCap,
    value: "200+",
    label: "Expert Instructors",
  },
  {
    icon: Target,
    value: "95%",
    label: "Completion Rate",
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
  },
  {
    name: "Michael Chen",
    role: "UX Designer",
    image: "",
    rating: 5,
    quote:
      "The best e-learning platform I've used. The instructors are knowledgeable and the content is always up-to-date.",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Specialist",
    image: "",
    rating: 5,
    quote:
      "I love the community aspect of Codexa. It's not just about learning, it's about growing together.",
  },
];

export const footerLinks = {
  platform: [
    { label: "About Us", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Careers", href: "/careers" },
  ],
  resources: [
    { label: "All Courses", href: "/courses" },
    { label: "Community", href: "/community" },
    { label: "Blog", href: "/blog" },
    { label: "Help Center", href: "/help" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};
