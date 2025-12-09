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