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

function EnrollmentSection({ course }) {
  const enrolledCount = course.enrolledStudents?.length || 0;

  if (enrolledCount === 0) return null;

  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Enrolled Students
        </h2>
        <Badge variant="secondary" className="text-base px-3 py-1">
          {enrolledCount} {enrolledCount === 1 ? "Student" : "Students"}
        </Badge>
      </div>
      <p className="text-muted-foreground">
        This course currently has {enrolledCount} enrolled{" "}
        {enrolledCount === 1 ? "student" : "students"}.
      </p>
    </div>
  );
}

function VideosSection({ course, onPlay, onDelete }) {
  if (!course.videos?.length) {
    return (
      <div className="bg-card rounded-xl p-12 border shadow-sm text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Video className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-card-foreground mb-2">
          No Videos Yet
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Start building your course by uploading video lessons. Your students
          will be able to access them once published.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          Course Content
        </h2>
        <Badge variant="secondary" className="text-base px-3 py-1">
          {course.videos.length}{" "}
          {course.videos.length === 1 ? "Video" : "Videos"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {course.videos.map((video, i) => (
          <div
            key={video._id || i}
            className="group relative rounded-xl border-2 overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
          >
            <div className="relative aspect-video bg-muted">
              {video.url ? (
                <video src={video.url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={() => onPlay(video)}
                  size="icon"
                  className="w-14 h-14 rounded-full shadow-xl"
                >
                  <PlayCircle className="w-7 h-7" />
                </Button>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => onDelete(video)}
                  className="rounded-full shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 bg-card">
              <p className="font-semibold text-sm text-card-foreground truncate">
                {video.title || `Lesson ${i + 1}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Video {i + 1} of {course.videos.length}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditCourseDialog({
  open,
  setOpen,
  editData,
  setEditData,
  onSave,
  loading,
}) {
  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course Information</DialogTitle>
          <DialogDescription>
            Update your course details. All fields are optional - only updated
            fields will be changed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Course Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Enter course title"
                  value={editData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price ($) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={editData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what students will learn in this course..."
                value={editData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Input
                  id="category"
                  placeholder="e.g., Web Development"
                  value={editData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium">
                  Language
                </Label>
                <Input
                  id="language"
                  placeholder="e.g., English, Arabic"
                  value={editData.language}
                  onChange={(e) =>
                    handleInputChange("language", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Course Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Course Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">
                  Difficulty Level
                </Label>
                <Select
                  value={editData.level}
                  onValueChange={(value) => handleInputChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="all levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Course Status
                </Label>
                <Select
                  value={editData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Additional Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="prerequisites" className="text-sm font-medium">
                Prerequisites
              </Label>
              <Textarea
                id="prerequisites"
                placeholder="What should students know before taking this course? (Optional)"
                value={editData.prerequisites}
                onChange={(e) =>
                  handleInputChange("prerequisites", e.target.value)
                }
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                List any required knowledge, skills, or tools students should
                have
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={
              loading ||
              !editData.title ||
              !editData.description ||
              !editData.price ||
              !editData.category
            }
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>

        {/* Required Fields Note */}
        <div className="text-xs text-muted-foreground border-t pt-3">
          <p>* Required fields: Title, Description, Price, and Category</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UploadCoverImageDialog({
  open,
  setOpen,
  selectedCoverImage,
  imagePreview,
  onFileSelect,
  onRemoveImage,
  onUpload,
  loading,
  currentCoverImage,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Cover Image</DialogTitle>
          <DialogDescription>
            Choose a new cover image for your course. Recommended: 1280x720
            pixels, max 5MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Cover Image Preview */}
          {currentCoverImage && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Cover</Label>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={currentCoverImage}
                  alt="Current cover"
                  className="w-full h-32 object-cover"
                />
              </div>
            </div>
          )}

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">New Cover Image</Label>
            {!selectedCoverImage ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/40 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileSelect}
                  className="hidden"
                  id="cover-image-upload"
                />
                <label
                  htmlFor="cover-image-upload"
                  className="cursor-pointer block"
                >
                  <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to select an image
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, JPEG up to 5MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Selected Image</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onRemoveImage}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedCoverImage.name}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={onUpload} disabled={loading || !selectedCoverImage}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Cover
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UploadVideosDialog({
  open,
  setOpen,
  selectedFiles,
  onFileSelect,
  onUpload,
  loading,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload New Videos</DialogTitle>
          <DialogDescription>
            Select multiple video files to upload to this course.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/40 transition-colors">
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={onFileSelect}
              className="hidden"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="cursor-pointer block">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to select video files
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports multiple files
              </p>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium text-foreground mb-2">
                Selected files ({selectedFiles.length}):
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="text-xs text-muted-foreground truncate"
                  >
                    • {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onUpload}
            disabled={loading || !selectedFiles.length}
          >
            <Upload className="w-4 h-4 mr-2" />
            {loading ? "Uploading..." : "Upload Videos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VideoDialog({ video, onClose }) {
  return (
    <Dialog open={!!video} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            {video?.title}
          </DialogTitle>
        </DialogHeader>
        {video && (
          <video
            src={video.url}
            controls
            autoPlay
            className="w-full rounded-lg border"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DeleteVideoDialog({ video, onCancel, onConfirm }) {
  return (
    <AlertDialog open={!!video} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this video?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently remove "{video?.title}" from the
            course.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
