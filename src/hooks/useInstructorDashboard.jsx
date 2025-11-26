// i added this file but it is not used in the project we will use it later when refactor ***

// src/hooks/useInstructorDashboardData.js
import { useInstructorCourse } from "@/hooks/useInstructorCourse";
import { PerformanceStructure } from "@/constants/instructorDashboard";

export const useInstructorDashboardData = () => {
    const { courses, totalStudents, rating, revenue } = useInstructorCourse();

    const Performances = PerformanceStructure.map((item) => {
        switch (item.key) {
            case "totalStudents":
                return { ...item, number: totalStudents };
            case "activeCourses":
                return { ...item, number: courses.length };
            case "rating":
                return { ...item, number: rating };
            case "revenue":
                return { ...item, number: `$${revenue}` };
            default:
                return item;
        }
    });

    const ActiveCourses = courses.map((course) => ({
        imgSrc: course.thumbnail,
        TextContent: {
            title: course.title,
            num: `${course.enrolledCount} Students`,
        },
    }));

    return { Performances, ActiveCourses };
};
