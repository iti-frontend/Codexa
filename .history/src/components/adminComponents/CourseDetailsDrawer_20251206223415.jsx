"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
    BookOpen,
    Calendar,
    User,
    Layers,
    Tag,
    BadgeDollarSign,
    Info,
    Trash,
} from "lucide-react";

import { useAdminCourseDetails } from "@/hooks/useAdminCourses";
import { useAdminDeleteCourse } from "@/hooks/useAdminDelete";

import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { toast } from "sonner";
import { useState, useEffect } from "react";

// ---------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------

export default function CourseDetailsDrawer({
    open,
    onClose,
    courseId,
    onDelete, // parent UI-remove handler
}) {
    const {
        data: course,
        loading: detailsLoading,
        error: detailsError,
    } = useAdminCourseDetails(courseId);

    const { deleteCourse, loading: deleteLoading } = useAdminDeleteCourse();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const isEmpty = !course && !detailsLoading;

    // const handleDelete = async () => {
    //     const ok = await deleteCourse(course._id);

    //     if (ok) {
    //         toast.success("Course deleted successfully");

    //         // Notify parent to remove card from UI
    //         onDelete?.(course);

    //         // Close dialog + drawer
    //         setShowDeleteDialog(false);
    //         onClose();
    //     } else {
    //         toast.error("Failed to delete course");
    //     }
    // };
    const handleDelete = async () => {
        const ok = await deleteCourse(course._id);

        if (ok) {
            toast.success("Course deleted successfully");

            await onDelete?.();  // 🚀 refetch courses
            setShowDeleteDialog(false);
            onClose();           // close drawer
        } else {
            toast.error("Failed to delete course");
        }
    };


    useEffect(() => {
        if (!open) {
            setShowDeleteDialog(false); // <-- force close dialog
        }
    }, [open]);


    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                if (!state) {
                    setShowDeleteDialog(false); // force close delete dialog
                    onClose();                  // then close drawer
                }
            }}
        >
            <DialogContent
                className="
                    max-w-xl 
                    rounded-2xl 
                    p-0 
                    overflow-hidden 
                    max-h-[90vh]
                    flex flex-col
                "
            >
                {/* HEADER */}
                <div className="p-6 border-b">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            Course Details
                        </DialogTitle>
                    </DialogHeader>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="p-6 space-y-6 overflow-y-auto">

                    {/* LOADING */}
                    {detailsLoading && (
                        <div className="py-12 flex justify-center">
                            <div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full"></div>
                        </div>
                    )}

                    {/* ERROR */}
                    {detailsError && (
                        <p className="text-center text-red-500">
                            {detailsError}
                        </p>
                    )}

                    {/* EMPTY */}
                    {isEmpty && (
                        <p className="text-center text-muted-foreground">
                            No course selected.
                        </p>
                    )}

                    {/* CONTENT */}
                    {!detailsLoading && course && (
                        <div className="space-y-6">

                            {/* COVER + TITLE */}
                            <div className="flex flex-col items-center gap-3 text-center">
                                <img
                                    src={course.coverImage?.url}
                                    alt={course.title}
                                    className="w-full h-48 object-cover rounded-xl shadow"
                                />

                                <h2 className="text-xl font-semibold">{course.title}</h2>

                                <p className="text-muted-foreground text-sm max-w-md">
                                    {course.description}
                                </p>

                                <Badge variant="secondary" className="px-3 py-1 text-xs">
                                    {course.category}
                                </Badge>
                            </div>

                            {/* DETAILS */}
                            <Section>
                                <InfoRow icon={<BadgeDollarSign />} label="Price" value={`$${course.price}`} />
                                <InfoRow icon={<Layers />} label="Level" value={course.level} />
                                <InfoRow icon={<Tag />} label="Status" value={course.status} />
                                <InfoRow icon={<Info />} label="Prerequisites" value={course.prerequisites} />

                                <InfoRow
                                    icon={<Calendar />}
                                    label="Created At"
                                    value={course.statistics?.createdAt ? new Date(course.statistics.createdAt).toLocaleDateString() : "—"}
                                />

                                <InfoRow
                                    icon={<Calendar />}
                                    label="Last Update"
                                    value={course.statistics?.updatedAt ? new Date(course.statistics.updatedAt).toLocaleDateString() : "—"}
                                />
                            </Section>

                            {/* INSTRUCTOR */}
                            <Section>
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Instructor</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={course.instructor?.profileImage} />
                                        <AvatarFallback>
                                            {course.instructor?.name?.charAt(0)?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <p className="font-medium">{course.instructor?.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {course.instructor?.email}
                                        </p>
                                    </div>
                                </div>
                            </Section>

                            {/* STATISTICS */}
                            <Section>
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Course Statistics</span>
                                </div>

                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Total Videos: {course.statistics?.totalVideos ?? "—"}</p>
                                    <p>Enrolled Students: {course.statistics?.enrolledStudentsCount ?? "—"}</p>
                                </div>
                            </Section>

                            {/* ACTIONS */}
                            <div className="flex justify-end pt-2 gap-3">
                                <Button variant="outline" onClick={onClose}>
                                    Close
                                </Button>

                                <Button
                                    variant="destructive"
                                    className="flex items-center gap-2"
                                    disabled={deleteLoading}
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    <Trash size={16} />
                                    {deleteLoading ? "Deleting..." : "Delete Course"}
                                </Button>
                            </div>

                        </div>
                    )}
                </div>
            </DialogContent>

            {/* DELETE CONFIRM MODAL */}
            <DeleteConfirmDialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                type="course"
                name={course?.title}
            />
        </Dialog>
    );
}

// ---------------------------------------------------
// SMALL UI COMPONENTS
// ---------------------------------------------------

function Section({ children }) {
    return (
        <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
            {children}
        </div>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="h-4 w-4 text-muted-foreground">{icon}</span>
            <span className="font-medium">{label}:</span>
            <span className="text-muted-foreground">{value}</span>
        </div>
    );
}
