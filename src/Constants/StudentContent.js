import {
  LoaderCircle,
  Award,
  BookOpen,
  CircleSlash,
  BookCheck,
} from "lucide-react";

export const StatsCards = [
  { text: "All Courses", key: "enrolledCourses", icon: BookOpen },

  { text: "Completed", key: "completedCourses", icon: BookCheck },

  { text: "In Progress", key: "inProgressCourses", icon: LoaderCircle },

  { text: "Todo Done", key: "todoDone", icon: Award },

  { text: "Todo Pending", key: "todoPending", icon: CircleSlash },
];

export const CourseInfo = {
  trackKey: "category",       // The field that represents course track
  titleKey: "title",
  instructorNameKey: "instructor.name",
  instructorImageKey: "instructor.profileImage",
};

export const followingUsers = [
  {
    name: "Jonas",
    role: "Mentor"

  },
  {
    name: "Maximilian",
    role: "Mentor"
  },
  {
    name: "Angela Yu",
    role: "Mentor"

  },
  {
    name: "Jonas",
    role: "Mentor"
  },
];

export const TodosCards = [
  { text: "Total Tasks", number: "9", icon: BookOpen },
  { text: "Completed ", number: "5", icon: BookCheck },
  { text: "Pending", number: "4", icon: LoaderCircle },
];

export const tasksData = [
  {
    id: 1,
    title: "Design landing page",
    status: "In Progress",
    priority: "High",
    completed: false,
    date: new Date(2025, 10, 1),
  },
  {
    id: 2,
    title: "Complete Next Js Course",
    status: "Pending",
    priority: "Medium",
    completed: false,
    date: new Date(2025, 10, 2),
  },
  {
    id: 3,
    title: "Write documentation",
    status: "Done",
    priority: "Low",
    completed: true,
    date: new Date(2025, 10, 3),
  },
];
