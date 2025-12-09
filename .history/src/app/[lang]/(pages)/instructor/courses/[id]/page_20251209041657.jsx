"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInstructorCourse } from "@/hooks/useInstructorCourse";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BookOpen,
  DollarSign,
  Clock,
  Users,
  Pencil,
  Trash2,
  Video,
  PlayCircle,
  Calendar,
  Globe,
  BarChart3,
  Upload,
  Image as ImageIcon,
  FileText,
  TrendingUp,
  CheckCircle2,
  UserCheck,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export default function CourseDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const router = useRouter();
  const {
    fetchCourseById,
    deleteCourse,
    updateCourse,
    updateCourseWithCoverImage,
    deleteCourseVideo,
    uploadNewVideoToCourse,
  } = useInstructorCourse();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    level: "",
    status: "",
    prerequisites: "",
    language: "",
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchCourseById(id)
        .then((data) => {
          setCourse(data);
          setEditData({
            title: data.title || "",
            description: data.description || "",
            price: data.price || "",
            category: data.category || "",
            level: data.level || "",
            status: data.status || "",
            prerequisites: data.prerequisites || "",
            language: data.language || "",
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleUpdateCourse = async () => {
    try {
      setEditing(true);
      await updateCourse(id, editData);
      toast.success(t('instructor.courseDetails.courseUpdated'));
      setOpenEditDialog(false);
      const updated = await fetchCourseById(id);
      setCourse(updated);
    } catch (err) {
      toast.error(t('instructor.courseDetails.updateFailed'));
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      setDeleting(true);
      await deleteCourse(id);
      toast.success(t('instructor.courseDetails.courseDeleted'));
      router.push("/instructor/courses");
    } catch {
      toast.error(t('instructor.courseDetails.deleteFailed'));
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await deleteCourseVideo(id, videoId);
      toast.success(t('instructor.courseDetails.videoDeleted'));
      setVideoToDelete(null);
      const updated = await fetchCourseById(id);
      setCourse(updated);
    } catch {
      toast.error(t('instructor.courseDetails.videoDeleteFailed'));
    }
  };

  const handleUploadVideos = async () => {
    if (!selectedFiles.length) {
      toast.error(t('instructor.courseDetails.selectVideoFile'));
      return;
    }

    try {
      setUploading(true);
      await uploadNewVideoToCourse(id, selectedFiles);
      toast.success(t('instructor.courseDetails.videosUploaded'));
      setOpenUploadDialog(false);
      setSelectedFiles([]);

      const updated = await fetchCourseById(id);
      setCourse(updated);
    } catch (error) {
      toast.error(t('instructor.courseDetails.videoUploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const handleUploadCoverImage = async () => {
    if (!selectedCoverImage) {
      toast.error(t('instructor.courseDetails.selectImageFile'));
      return;
    }

    try {
      setUploadingImage(true);
      await updateCourseWithCoverImage(id, {}, selectedCoverImage);
      toast.success(t('instructor.courseDetails.coverUpdated'));
      setOpenImageDialog(false);
      setSelectedCoverImage(null);
      setImagePreview(null);

      const updated = await fetchCourseById(id);
      setCourse(updated);
    } catch (error) {
      console.error("Failed to upload cover image:", error);
      toast.error(t('instructor.courseDetails.coverUploadFailed'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCoverImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t('instructor.courseDetails.selectImageOnly'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('instructor.courseDetails.imageSizeLimit'));
      return;
    }

    setSelectedCoverImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSelectedImage = () => {
    setSelectedCoverImage(null);
    setImagePreview(null);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        {t('instructor.courseDetails.courseNotFound')}
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <HeaderSection
        course={course}
        onEdit={() => setOpenEditDialog(true)}
        onUpload={() => setOpenUploadDialog(true)}
        onUploadImage={() => setOpenImageDialog(true)}
        onDelete={handleDeleteCourse}
        deleting={deleting}
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <CoverImageSection
          course={course}
          onUploadImage={() => setOpenImageDialog(true)}
        />
        <StatsSection course={course} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InfoSection course={course} />
            <PrerequisitesSection course={course} />
          </div>
          <div className="space-y-6">
            <DetailsCard course={course} />
            <InstructorCard course={course} />
          </div>
        </div>
        <EnrollmentSection course={course} />
        <VideosSection
          course={course}
          onPlay={(video) => setSelectedVideo(video)}
          onDelete={(video) => setVideoToDelete(video)}
        />
      </div>

      <EditCourseDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        editData={editData}
        setEditData={setEditData}
        onSave={handleUpdateCourse}
        loading={editing}
      />

      <UploadCoverImageDialog
        open={openImageDialog}
        setOpen={setOpenImageDialog}
        selectedCoverImage={selectedCoverImage}
        imagePreview={imagePreview}
        onFileSelect={handleCoverImageSelect}
        onRemoveImage={handleRemoveSelectedImage}
        onUpload={handleUploadCoverImage}
        loading={uploadingImage}
        currentCoverImage={course.coverImage?.url}
      />

      <UploadVideosDialog
        open={openUploadDialog}
        setOpen={setOpenUploadDialog}
        selectedFiles={selectedFiles}
        onFileSelect={handleFileSelect}
        onUpload={handleUploadVideos}
        loading={uploading}
      />

      <VideoDialog
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      <DeleteVideoDialog
        video={videoToDelete}
        onCancel={() => setVideoToDelete(null)}
        onConfirm={() => handleDeleteVideo(videoToDelete?._id)}
      />
    </div>
  );
}

// ----------------------------
// Sub Components
// ----------------------------
// نكمل الـ Components...
// استورد useTranslation في أول كل component

function HeaderSection({ course, onEdit, onUpload, onUploadImage, onDelete, deleting }) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-card border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">{course.title}</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={course.status === "public" ? "default" : "secondary"} className="font-medium">
                {course.status || t('instructor.courseDetails.draft')}
              </Badge>
              <span className="text-sm text-muted-foreground font-medium">
                {course.category || "General"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onUpload}>
            <Upload className="w-4 h-4 mr-2" />
            {t('instructor.courseDetails.uploadVideos')}
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            {t('instructor.courseDetails.edit')}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={deleting} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? t('instructor.courseDetails.deleting') : t('instructor.courseDetails.delete')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('instructor.courseDetails.deleteConfirm')}</AlertDialogTitle>
                <AlertDialogDescription>{t('instructor.courseDetails.deleteDescription')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>{t('instructor.courseDetails.cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2">
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('instructor.courseDetails.deleting')}
                    </>
                  ) : t('instructor.courseDetails.delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function CoverImageSection({ course, onUploadImage }) {
  const { t } = useTranslation();
  
  return (
    <div className="relative w-full h-80 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background border shadow-lg group">
      {course.coverImage?.url ? (
        <>
          <img src={course.coverImage.url} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">{t('instructor.courseDetails.noCoverImage')}</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
        <Button onClick={onUploadImage} size="lg" className="shadow-xl">
          <ImageIcon className="w-5 h-5 mr-2" />
          {course.coverImage?.url ? t('instructor.courseDetails.changeCover') : t('instructor.courseDetails.uploadCover')}
        </Button>
      </div>
      {course.coverImage?.url && (
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">{course.title}</h2>
          <p className="text-white/90 mt-2 text-lg drop-shadow-md">{course.category}</p>
        </div>
      )}
    </div>
  );
}

function StatsSection({ course }) {
  const { t } = useTranslation();
  
  const stats = [
    {
      label: t('instructor.courseDetails.price'),
      value: `$${course.price}`,
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      borderColor: "border-emerald-200 dark:border-emerald-900",
    },
    {
      label: t('instructor.courseDetails.duration'),
      value: course.duration || "N/A",
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-900",
    },
    {
      label: t('instructor.courseDetails.enrolledStudents'),
      value: course.enrolledStudents?.length || 0,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-900",
    },
    {
      label: t('instructor.courseDetails.level'),
      value: course.level || t('instructor.courseDetails.allLevels'),
      icon: BarChart3,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      borderColor: "border-orange-200 dark:border-orange-900",
    },
    {
      label: t('instructor.courseDetails.progressTracking'),
      value: course.progress?.length || 0,
      icon: TrendingUp,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
      borderColor: "border-cyan-200 dark:border-cyan-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map(({ label, value, icon: Icon, color, bgColor, borderColor }) => (
        <div key={label} className={cn("bg-card rounded-xl p-5 border-2 shadow-sm hover:shadow-md transition-all", borderColor)}>
          <div className="flex items-start justify-between mb-3">
            <div className={cn("w-11 h-11 rounded-lg flex items-center justify-center", bgColor)}>
              <Icon className={cn("w-5 h-5", color)} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}

function InfoSection({ course }) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-card-foreground">{t('instructor.courseDetails.courseDescription')}</h2>
      </div>
      <p className="text-muted-foreground leading-relaxed text-base">
        {course.description || t('instructor.courseDetails.noDescription')}
      </p>
    </div>
  );
}

function PrerequisitesSection({ course }) {
  const { t } = useTranslation();
  
  if (!course.prerequisites) return null;

  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-card-foreground">{t('instructor.courseDetails.prerequisites')}</h2>
      </div>
      <p className="text-muted-foreground leading-relaxed text-base">{course.prerequisites}</p>
    </div>
  );
}

function DetailsCard({ course }) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <h2 className="text-xl font-bold text-card-foreground mb-5 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        {t('instructor.courseDetails.courseDetails')}
      </h2>
      <div className="space-y-4">
        <DetailItem icon={Globe} label={t('instructor.courseDetails.language')} value={course.language || t('instructor.courseDetails.english')} />
        <DetailItem icon={BarChart3} label={t('instructor.courseDetails.difficultyLevel')} value={course.level || t('instructor.courseDetails.allLevels')} />
        <DetailItem icon={Video} label={t('instructor.courseDetails.totalVideos')} value={`${course.videos?.length || 0} ${t('instructor.courseDetails.lessons')}`} />
        <DetailItem icon={Calendar} label={t('instructor.courseDetails.created')} value={course.createdAt ? new Date(course.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"} />
        <DetailItem icon={Calendar} label={t('instructor.courseDetails.lastUpdated')} value={course.updatedAt ? new Date(course.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"} />
      </div>
    </div>
  );
}

function InstructorCard({ course }) {
  const { t } = useTranslation();
  
  if (!course.instructor) return null;

  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <h2 className="text-xl font-bold text-card-foreground mb-5 flex items-center gap-2">
        <UserCheck className="w-5 h-5 text-primary" />
        {t('instructor.courseDetails.instructor')}
      </h2>
      <div className="flex items-center gap-4">
        {course.instructor.profileImage ? (
          <img src={"/auth/login.png"} alt={course.instructor.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
            <UserCheck className="w-8 h-8 text-primary" />
          </div>
        )}
        <div>
          <p className="font-bold text-card-foreground text-lg">{course.instructor.name}</p>
          <p className="text-sm text-muted-foreground">{t('instructor.courseDetails.courseInstructor')}</p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
        <p className="font-semibold text-card-foreground">{value}</p>
      </div>
    </div>
  );
}
