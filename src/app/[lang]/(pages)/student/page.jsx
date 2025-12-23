"use client";
import ContinueCourses from "@/components/Dashboard/ContinueCourses";
import SavedCourses from "@/components/Dashboard/SavedCourses";
import StudentActivity from "@/components/Dashboard/StudentActivity";
import StudentHeader from "@/components/Dashboard/StudentHeader";
function StudentDashboard() {
    return (
        <div className="p-5 grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="flex flex-col gap-8 w-full xl:col-span-8">
                <StudentHeader />
                <StudentActivity />
                <ContinueCourses />

            </div>

            <div className="flex flex-col gap-8 w-full xl:col-span-4">
                <SavedCourses />
            </div>
        </div>
    );
}
export default StudentDashboard;
