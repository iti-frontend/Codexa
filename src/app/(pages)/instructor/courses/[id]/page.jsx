"use client";
import { useEffect, useState } from "react";
import { useInstructorCourse } from "@/hooks/useInstructorCourse";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "lucide-react";
import { toast } from "sonner";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    fetchCourseById,
    deleteCourse,
    updateCourse,
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
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

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
      toast.success("Course updated successfully!");
      setOpenEditDialog(false);
      const updated = await fetchCourseById(id);
      setCourse(updated);
    } catch (err) {
      toast.error("Failed to update course");
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      setDeleting(true);
      await deleteCourse(id);
      toast.success("Course deleted");
      router.push("/instructor/courses");
    } catch {
      toast.error("Failed to delete course");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await deleteCourseVideo(id, videoId);
      toast.success("Video deleted");
      setVideoToDelete(null);
      const updated = await fetchCourseById(id);
      setCourse(updated);
    } catch {
      toast.error("Failed to delete video");
    }
  };

  const handleUploadVideos = async () => {
    if (!selectedFiles.length) {
      toast.error("Please select at least one video file");
      return;
    }

    try {
      setUploading(true);
      await uploadNewVideoToCourse(id, selectedFiles);
      toast.success("Videos uploaded successfully!");
      setOpenUploadDialog(false);
      setSelectedFiles([]);

      // Refresh course data to show new videos
      const updated = await fetchCourseById(id);
      setCourse(updated);
    } catch (error) {
      toast.error("Failed to upload videos");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Course not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSection
        course={course}
        onEdit={() => setOpenEditDialog(true)}
        onUpload={() => setOpenUploadDialog(true)}
        onDelete={handleDeleteCourse}
        deleting={deleting}
      />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <StatsSection course={course} />
        <InfoSection course={course} />
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
function HeaderSection({ course, onEdit, onUpload, onDelete, deleting }) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {course.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={
                  course.status === "published" ? "default" : "secondary"
                }
              >
                {course.status || "Draft"}
              </Badge>
              <span className="text-sm text-gray-500">
                {course.category || "General"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onUpload}>
            <Upload className="w-4 h-4 mr-1" /> Upload Videos
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-1" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={deleting}
                className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the course. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function StatsSection({ course }) {
  const stats = [
    {
      label: "Price",
      value: `$${course.price}`,
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Duration",
      value: course.duration || "N/A",
      icon: Clock,
      color: "blue",
    },
    {
      label: "Students",
      value: course.enrolledCount || 0,
      icon: Users,
      color: "purple",
    },
    {
      label: "Level",
      value: course.level || "All",
      icon: BarChart3,
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-lg p-5 border">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}
            >
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-semibold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoSection({ course }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-3">Description</h2>
        <p className="text-gray-600">{course.description}</p>
      </div>
      <div className="bg-white rounded-lg p-6 border space-y-4">
        <h2 className="text-lg font-semibold mb-3">Details</h2>
        <div className="space-y-3 text-sm">
          <DetailItem
            icon={Globe}
            label="Language"
            value={course.language || "English"}
          />
          <DetailItem
            icon={Calendar}
            label="Last Updated"
            value={
              course.updatedAt
                ? new Date(course.updatedAt).toLocaleDateString()
                : "N/A"
            }
          />
          <DetailItem
            icon={Video}
            label="Videos"
            value={`${course.videos?.length || 0} lessons`}
          />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function VideosSection({ course, onPlay, onDelete }) {
  if (!course.videos?.length) {
    return (
      <div className="bg-white rounded-lg p-6 border text-center">
        <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Videos Yet
        </h3>
        <p className="text-gray-500 mb-4">
          Upload videos to get started with your course content.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Course Content</h2>
        <Badge variant="secondary">{course.videos.length} videos</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {course.videos.map((video, i) => (
          <div
            key={video.id || i}
            className="group relative rounded-lg border overflow-hidden hover:border-blue-500 transition-all"
          >
            <div className="relative aspect-video bg-gray-900">
              <video src={video.url} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button
                  onClick={() => onPlay(video)}
                  size="icon"
                  className="bg-white/90 hover:bg-white"
                >
                  <PlayCircle className="text-gray-800" />
                </Button>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <p className="font-medium text-sm">{video.title}</p>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(video)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <input
            className="w-full border rounded p-2"
            placeholder="Title"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
          />
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Description"
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
          />
          <input
            type="number"
            className="w-full border rounded p-2"
            placeholder="Price"
            value={editData.price}
            onChange={(e) =>
              setEditData({ ...editData, price: e.target.value })
            }
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={onFileSelect}
              className="hidden"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="cursor-pointer block">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Click to select video files
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports multiple files
              </p>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected files ({selectedFiles.length}):
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="text-xs text-gray-600 truncate">
                    • {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
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
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            {loading ? "Uploading..." : "Upload Videos"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VideoDialog({ video, onClose }) {
  return (
    <Dialog open={!!video} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{video?.title}</DialogTitle>
          <DialogDescription>{video?.description}</DialogDescription>
        </DialogHeader>
        {video && (
          <video
            src={video.url}
            controls
            autoPlay
            className="w-full rounded-lg"
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
            This action will permanently remove the selected video.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
