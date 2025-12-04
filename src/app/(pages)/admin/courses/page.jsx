// "use client";

// import { useState, useMemo } from "react";
// import { Input } from "@/components/ui/input";
// import {
//     Select,
//     SelectTrigger,
//     SelectContent,
//     SelectItem,
//     SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { BookOpen, Search, Trash } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// import { useAdminCourses } from "@/hooks/useAdminCourses";
// import { useAdminDeleteCourse } from "@/hooks/useAdminDelete";

// import CourseDetailsDrawer from "@/components/adminComponents/CourseDetailsDrawer";
// import { DeleteConfirmDialog } from "@/components/adminComponents/DeleteConfirmDialog";

// export default function AdminCoursesPage() {
//     const [search, setSearch] = useState("");
//     const [category, setCategory] = useState("all");
//     const [visibleCount, setVisibleCount] = useState(9);

//     const [drawerOpen, setDrawerOpen] = useState(false);
//     const [selectedCourse, setSelectedCourse] = useState(null);

//     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//     const [courseToDelete, setCourseToDelete] = useState(null);

//     const { courses, loading, error } = useAdminCourses({
//         page: 1,
//         limit: 1000,
//     });

//     const { deleteCourse, loading: deleteLoading } = useAdminDeleteCourse();

//     const openDrawer = (course) => {
//         setSelectedCourse(course);
//         setDrawerOpen(true);
//     };

//     const closeDrawer = () => {
//         setSelectedCourse(null);
//         setDrawerOpen(false);
//     };

//     const askDeleteCourse = (course) => {
//         setCourseToDelete(course);
//         setDeleteDialogOpen(true);
//     };

//     const confirmDeleteCourse = async () => {
//         if (!courseToDelete) return;

//         const ok = await deleteCourse(courseToDelete._id);

//         if (ok) {
//             toast.success("Course deleted successfully");

//             // Remove from UI without refetching
//             courses.splice(
//                 courses.findIndex((c) => c._id === courseToDelete._id),
//                 1
//             );

//             setDeleteDialogOpen(false);
//             setCourseToDelete(null);
//         } else {
//             toast.error("Failed to delete course");
//         }
//     };

//     const filteredCourses = useMemo(() => {
//         return courses.filter((course) => {
//             const matchSearch = course.title
//                 .toLowerCase()
//                 .includes(search.toLowerCase());
//             const matchCategory =
//                 category === "all" || course.category === category;

//             return matchSearch && matchCategory;
//         });
//     }, [courses, search, category]);

//     const handleScroll = (e) => {
//         const bottom =
//             e.currentTarget.scrollHeight -
//             e.currentTarget.scrollTop -
//             e.currentTarget.clientHeight <
//             50;

//         if (bottom) {
//             setVisibleCount((prev) =>
//                 Math.min(prev + 6, filteredCourses.length)
//             );
//         }
//     };

//     return (
//         <div className="p-6 space-y-6">
//             {/* PAGE HEADER */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <h1 className="text-2xl font-bold flex items-center gap-2">
//                     <BookOpen className="h-6 w-6 text-muted-foreground" />
//                     All Courses
//                 </h1>

//                 {/* FILTERS */}
//                 <div className="flex items-center gap-3 w-full md:w-auto">
//                     <div className="relative w-full md:w-64">
//                         <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                         <Input
//                             placeholder="Search courses..."
//                             className="pl-8"
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                         />
//                     </div>

//                     <Select value={category} onValueChange={setCategory}>
//                         <SelectTrigger className="w-40">
//                             <SelectValue placeholder="Category" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="all">All</SelectItem>
//                             {Array.from(new Set(courses.map((c) => c.category))).map(
//                                 (cat) => (
//                                     <SelectItem key={cat} value={cat}>
//                                         {cat}
//                                     </SelectItem>
//                                 )
//                             )}
//                         </SelectContent>
//                     </Select>
//                 </div>
//             </div>

//             {/* LOADING */}
//             {loading && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {[...Array(6)].map((_, i) => (
//                         <Skeleton key={i} className="h-48 rounded-xl" />
//                     ))}
//                 </div>
//             )}

//             {/* ERROR */}
//             {error && (
//                 <p className="text-red-500 text-center py-6">{error}</p>
//             )}

//             {/* COURSES GRID */}
//             {!loading && !error && filteredCourses.length > 0 && (
//                 <div
//                     className="h-[70vh] overflow-y-auto pr-2"
//                     onScroll={handleScroll}
//                 >
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {filteredCourses.slice(0, visibleCount).map((course) => (
//                             <Card
//                                 key={course._id}
//                                 className="rounded-2xl overflow-hidden border hover:shadow-lg hover:scale-[1.03] transition-transform duration-300"
//                             >
//                                 <img
//                                     src={course.coverImage?.url}
//                                     alt={course.title}
//                                     className="w-full h-40 object-cover"
//                                 />

//                                 <CardContent className="p-4 space-y-3">
//                                     <h2 className="font-semibold text-lg leading-tight">
//                                         {course.title}
//                                     </h2>

//                                     <p className="text-sm text-muted-foreground line-clamp-2">
//                                         {course.description}
//                                     </p>

//                                     <Badge variant="secondary" className="w-fit">
//                                         {course.category}
//                                     </Badge>

//                                     {/* Instructor */}
//                                     {course.instructor && (
//                                         <div className="flex items-center gap-3 pt-2">
//                                             <img
//                                                 src={course.instructor.profileImage}
//                                                 alt={course.instructor.name}
//                                                 className="w-8 h-8 rounded-full object-cover border"
//                                             />
//                                             <span className="text-sm font-medium">
//                                                 {course.instructor.name}
//                                             </span>
//                                         </div>
//                                     )}

//                                     <div className="text-sm text-muted-foreground flex justify-between pt-2">
//                                         <span>Price: {course.price}$</span>
//                                         <span>{course.level}</span>
//                                     </div>

//                                     <div className="pt-2 flex items-center justify-between gap-2">
//                                         <Button
//                                             className="text-sm"
//                                             onClick={() => openDrawer(course)}
//                                         >
//                                             Details
//                                         </Button>

//                                         <Button
//                                             variant="destructive"
//                                             className="flex items-center gap-1 text-sm"
//                                             onClick={() => askDeleteCourse(course)}
//                                             disabled={deleteLoading}
//                                         >
//                                             <Trash size={14} />
//                                             {deleteLoading ? "Deleting..." : "Delete Course"}
//                                         </Button>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </div>

//                     {visibleCount >= filteredCourses.length && (
//                         <p className="text-center text-muted-foreground py-4">
//                             You've reached all courses.
//                         </p>
//                     )}
//                 </div>
//             )}

//             {/* EMPTY */}
//             {!loading && !error && filteredCourses.length === 0 && (
//                 <p className="text-center text-muted-foreground py-10">
//                     No courses found.
//                 </p>
//             )}

//             {/* COURSE DETAILS DRAWER */}
//             <CourseDetailsDrawer
//                 open={drawerOpen}
//                 onClose={closeDrawer}
//                 courseId={selectedCourse?._id}
//                 onDelete={() => askDeleteCourse(selectedCourse)}
//             />

//             {/* DELETE DIALOG */}
//             <DeleteConfirmDialog
//                 open={deleteDialogOpen}
//                 onClose={() => setDeleteDialogOpen(false)}
//                 onConfirm={confirmDeleteCourse}
//                 type="course"
//                 name={courseToDelete?.title}
//             />
//         </div>
//     );
// }
"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useAdminCourses } from "@/hooks/useAdminCourses";
import { useAdminDeleteCourse } from "@/hooks/useAdminDelete";

import CourseDetailsDrawer from "@/components/adminComponents/CourseDetailsDrawer";
import { DeleteConfirmDialog } from "@/components/adminComponents/DeleteConfirmDialog";

export default function AdminCoursesPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [visibleCount, setVisibleCount] = useState(9);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    // IMPORTANT: we MUST have setCourses returned from the hook
    const { courses, setCourses, loading, error, refetch } = useAdminCourses({
        page: 1,
        limit: 1000,
    });

    const { deleteCourse, loading: deleteLoading } = useAdminDeleteCourse();

    const openDrawer = (course) => {
        setSelectedCourse(course);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setSelectedCourse(null);
        setDrawerOpen(false);
    };

    const askDeleteCourse = (course) => {
        setCourseToDelete(course);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteCourse = async () => {
        if (!courseToDelete) return;

        const ok = await deleteCourse(courseToDelete._id);

        if (ok) {
            toast.success("Course deleted successfully");

            // IMPORTANT: immutable update
            setCourses((prev) => prev.filter(c => c._id !== courseToDelete._id));

            // Close dialog
            setDeleteDialogOpen(false);
            setCourseToDelete(null);

            // Close drawer if deleting opened course
            if (selectedCourse?._id === courseToDelete._id) {
                closeDrawer();
            }

        } else {
            toast.error("Failed to delete course");
        }
    };


    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const matchSearch = course.title
                .toLowerCase()
                .includes(search.toLowerCase());
            const matchCategory =
                category === "all" || course.category === category;

            return matchSearch && matchCategory;
        });
    }, [courses, search, category]);

    const handleScroll = (e) => {
        const bottom =
            e.currentTarget.scrollHeight -
            e.currentTarget.scrollTop -
            e.currentTarget.clientHeight <
            50;

        if (bottom) {
            setVisibleCount((prev) =>
                Math.min(prev + 6, filteredCourses.length)
            );
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                    All Courses
                </h1>

                {/* FILTERS */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search courses..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {Array.from(new Set(courses.map((c) => c.category))).map(
                                (cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* LOADING */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-xl" />
                    ))}
                </div>
            )}

            {/* ERROR */}
            {error && (
                <p className="text-red-500 text-center py-6">{error}</p>
            )}

            {/* COURSES GRID */}
            {!loading && !error && filteredCourses.length > 0 && (
                <div
                    className="h-[70vh] overflow-y-auto pr-2"
                    onScroll={handleScroll}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.slice(0, visibleCount).map((course) => (
                            <Card
                                key={course._id}
                                className="rounded-2xl overflow-hidden border hover:shadow-lg hover:scale-[1.03] transition-transform duration-300"
                            >
                                <img
                                    src={course.coverImage?.url}
                                    alt={course.title}
                                    className="w-full h-40 object-cover"
                                />

                                <CardContent className="p-4 space-y-3">
                                    <h2 className="font-semibold text-lg leading-tight">
                                        {course.title}
                                    </h2>

                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {course.description}
                                    </p>

                                    <Badge variant="secondary" className="w-fit">
                                        {course.category}
                                    </Badge>

                                    {/* Instructor */}
                                    {course.instructor && (
                                        <div className="flex items-center gap-3 pt-2">
                                            <img
                                                src={course.instructor.profileImage}
                                                alt={course.instructor.name}
                                                className="w-8 h-8 rounded-full object-cover border"
                                            />
                                            <span className="text-sm font-medium">
                                                {course.instructor.name}
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-sm text-muted-foreground flex justify-between pt-2">
                                        <span>Price: {course.price}$</span>
                                        <span>{course.level}</span>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between gap-2">
                                        <Button
                                            className="text-sm"
                                            onClick={() => openDrawer(course)}
                                        >
                                            Details
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            className="flex items-center gap-1 text-sm"
                                            onClick={() => askDeleteCourse(course)}
                                            disabled={deleteLoading}
                                        >
                                            <Trash size={14} />
                                            {deleteLoading ? "Deleting..." : "Delete Course"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* EMPTY */}
            {!loading && !error && filteredCourses.length === 0 && (
                <p className="text-center text-muted-foreground py-10">
                    No courses found.
                </p>
            )}

            {/* COURSE DETAILS DRAWER */}
            <CourseDetailsDrawer
                open={drawerOpen}
                onClose={closeDrawer}
                courseId={selectedCourse?._id}
                onDelete={refetch}
            />

            {/* DELETE DIALOG */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDeleteCourse}
                type="course"
                name={courseToDelete?.title}
            />
        </div>
    );
}
