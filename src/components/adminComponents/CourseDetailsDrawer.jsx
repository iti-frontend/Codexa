"use client";

import { useTranslation } from "react-i18next";
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
import { OptimizedImg } from "@/components/ui/optimized-image";

export default function CourseDetailsDrawer({
    open,
    onClose,
    courseId,
    onDelete,
}) {
    const { t } = useTranslation();
    const {
        data: course,
        loading: detailsLoading,
        error: detailsError,
    } = useAdminCourseDetails(courseId);

    const { deleteCourse, loading: deleteLoading } = useAdminDeleteCourse();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const isEmpty = !course && !detailsLoading;

    const handleDelete = async () => {
        const ok = await deleteCourse(course._id);

        if (ok) {
            toast.success(t("admin.courses.courseDeleted"));

            await onDelete?.();
            setShowDeleteDialog(false);
            onClose();
        } else {
            toast.error(t("admin.courses.deleteFailed"));
        }
    };

    useEffect(() => {
        if (!open) {
            setShowDeleteDialog(false);
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                if (!state) {
                    setShowDeleteDialog(false);
                    onClose();
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
                            {t("admin.courses.drawer.title")}
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
                            {t("admin.courses.drawer.noCourse")}
                        </p>
                    )}

                    {/* CONTENT */}
                    {!detailsLoading && course && (
                        <div className="space-y-6">

                            {/* COVER + TITLE */}
                            <div className="flex flex-col items-center gap-3 text-center">
                                <OptimizedImg
                                    src={course.coverImage?.url}
                                    alt={course.title}
                                    fallbackSrc="/auth/login.png"
                                    containerClassName="w-full h-48 rounded-xl shadow overflow-hidden"
                                    className="w-full h-full object-cover"
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
                                <InfoRow
                                    icon={<BadgeDollarSign />}
                                    label={t("admin.courses.drawer.price")}
                                    value={`$${course.price}`}
                                />
                                <InfoRow
                                    icon={<Layers />}
                                    label={t("admin.courses.drawer.level")}
                                    value={course.level}
                                />
                                <InfoRow
                                    icon={<Tag />}
                                    label={t("admin.courses.drawer.status")}
                                    value={course.status}
                                />
                                <InfoRow
                                    icon={<Info />}
                                    label={t("admin.courses.drawer.prerequisites")}
                                    value={course.prerequisites || "—"}
                                />

                                <InfoRow
                                    icon={<Calendar />}
                                    label={t("admin.courses.drawer.createdAt")}
                                    value={course.statistics?.createdAt
                                        ? new Date(course.statistics.createdAt).toLocaleDateString()
                                        : "—"
                                    }
                                />

                                <InfoRow
                                    icon={<Calendar />}
                                    label={t("admin.courses.drawer.lastUpdate")}
                                    value={course.statistics?.updatedAt
                                        ? new Date(course.statistics.updatedAt).toLocaleDateString()
                                        : "—"
                                    }
                                />
                            </Section>

                            {/* INSTRUCTOR */}
                            <Section>
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {t("admin.courses.drawer.instructor")}
                                    </span>
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
                                    <span className="font-medium">
                                        {t("admin.courses.drawer.statistics")}
                                    </span>
                                </div>

                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>
                                        {t("admin.courses.drawer.totalVideos")}: {course.statistics?.totalVideos ?? "—"}
                                    </p>
                                    <p>
                                        {t("admin.courses.drawer.enrolledStudents")}: {course.statistics?.enrolledStudentsCount ?? "—"}
                                    </p>
                                </div>
                            </Section>

                            {/* ACTIONS */}
                            <div className="flex justify-end pt-2 gap-3">
                                <Button variant="outline" onClick={onClose}>
                                    {t("admin.courses.drawer.close")}
                                </Button>

                                <Button
                                    variant="destructive"
                                    className="flex items-center gap-2"
                                    disabled={deleteLoading}
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    <Trash size={16} />
                                    {deleteLoading
                                        ? t("admin.courses.deleting")
                                        : t("admin.courses.drawer.deleteCourse")
                                    }
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