"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useInstructorCourse } from "@/hooks/useInstructorCourse";
import { useWizard, Wizard } from "react-use-wizard";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateCourseDialog({ open, onOpenChange }) {
  const {
    createCourse,
    register,
    handleSubmit,
    reset,
    errors,
    isSubmitting,
    uploadCourseVideos,
  } = useInstructorCourse();

  const [courseId, setCourseId] = useState(null);
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("public");

  const handleClose = () => {
    reset();
    setLevel("");
    setStatus("public");
    setCourseId(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <Wizard>
          <CourseDetails
            handleSubmit={handleSubmit}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            createCourse={createCourse}
            setCourseId={setCourseId}
            level={level}
            setLevel={setLevel}
            status={status}
            setStatus={setStatus}
          />
          <UploadVideoStep
            courseId={courseId}
            uploadCourseVideos={uploadCourseVideos}
            onClose={handleClose}
          />
        </Wizard>
      </DialogContent>
    </Dialog>
  );
}

function CourseDetails({
  handleSubmit,
  register,
  errors,
  isSubmitting,
  createCourse,
  setCourseId,
  level,
  setLevel,
  status,
  setStatus,
}) {
  const { nextStep } = useWizard();

  const onSubmit = async (data) => {
    if (!data.coverImage || !data.coverImage.length) {
      toast.error("Cover image is required!");
      return;
    }

    try {
      // Prepare course data with all fields
      const courseData = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        level: level || "beginner",
        status: status || "public",
        prerequisites: data.prerequisites || "",
        coverImage: data.coverImage,
      };

      const newCourse = await createCourse(courseData);
      setCourseId(newCourse._id);
      toast.success("Course created successfully!");
      nextStep();
    } catch (err) {
      console.error("Failed to create course:", err);
      // Error is handled in the hook
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 mt-4"
      encType="multipart/form-data"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Create New Course</h3>
        <p className="text-sm text-muted-foreground">
          Create a new course by filling in the details and uploading content.
        </p>
      </div>
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
          })}
          placeholder="Enter course title"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
          placeholder="Describe what students will learn in this course"
          disabled={isSubmitting}
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            {...register("category", {
              required: "Category is required",
              minLength: {
                value: 2,
                message: "Category must be at least 2 characters",
              },
            })}
            placeholder="e.g., Web Development"
            disabled={isSubmitting}
          />
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            {...register("price", {
              required: "Price is required",
              min: {
                value: 0,
                message: "Price must be 0 or greater",
              },
              valueAsNumber: true,
            })}
            placeholder="0"
            disabled={isSubmitting}
            step="0.01"
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Level */}
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose the difficulty level
          </p>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Public: Visible to all, Private: Only you can see
          </p>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="space-y-2">
        <Label htmlFor="prerequisites">Prerequisites</Label>
        <Textarea
          id="prerequisites"
          {...register("prerequisites")}
          placeholder="What should students know before taking this course?"
          disabled={isSubmitting}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Optional - list any required knowledge or skills
        </p>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image *</Label>
        <Input
          id="coverImage"
          type="file"
          {...register("coverImage", {
            required: "Cover image is required",
            validate: {
              isImage: (files) => {
                if (!files || !files.length) return true;
                const file = files[0];
                return (
                  file.type.startsWith("image/") ||
                  "Please select an image file"
                );
              },
              maxSize: (files) => {
                if (!files || !files.length) return true;
                const file = files[0];
                return (
                  file.size <= 5 * 1024 * 1024 || "Image must be less than 5MB"
                );
              },
            },
          })}
          accept="image/*"
          disabled={isSubmitting}
        />
        {errors.coverImage && (
          <p className="text-sm text-red-500">{errors.coverImage.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Recommended: 1280x720 pixels, max 5MB
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-24">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Creating..." : "Next"}
        </Button>
      </div>
    </form>
  );
}

function UploadVideoStep({ courseId, uploadCourseVideos, onClose }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { previousStep } = useWizard();

  const handleUpload = async () => {
    if (!courseId) {
      toast.error("Course creation failed. Please try again.");
      return;
    }

    if (!files.length) {
      toast.info("No videos selected. Course created successfully!");
      onClose();
      return;
    }

    try {
      setIsUploading(true);
      await uploadCourseVideos(courseId, files);
      toast.success("Videos uploaded successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to upload videos:", err);
      // Error is handled in the hook
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validate file types and sizes
    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("video/")) {
        toast.error(`"${file.name}" is not a video file`);
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        toast.error(`"${file.name}" is too large (max 100MB)`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  return (
    <div className="mt-4 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Upload Course Videos</h3>
        <p className="text-sm text-muted-foreground">
          Add videos to your course. You can skip this and add videos later.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="videos-upload">Select Video Files</Label>
          <Input
            id="videos-upload"
            type="file"
            multiple
            accept="video/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground">
            Supported formats: MP4, MOV, AVI, etc. Max 100MB per file
          </p>
        </div>

        {files.length > 0 && (
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">
              Selected Files ({files.length}):
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="text-sm text-muted-foreground flex justify-between items-center"
                >
                  <span className="truncate flex-1">• {file.name}</span>
                  <span className="text-xs">
                    ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <div className="flex gap-2">
          <Button onClick={onClose} variant="outline" disabled={isUploading}>
            Skip for now
          </Button>
        </div>
        <Button
          onClick={handleUpload}
          disabled={isUploading || !files.length}
          className="min-w-24"
        >
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading ? "Uploading..." : "Finish"}
        </Button>
      </div>
    </div>
  );
}
