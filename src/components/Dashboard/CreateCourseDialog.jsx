"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { useInstructorCourse } from "@/hooks/useInstructorCourse";
import { useWizard, Wizard } from "react-use-wizard";
import { useState } from "react";
import { toast } from "sonner";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <Wizard>
          <CourseDetails
            handleSubmit={handleSubmit}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            createCourse={createCourse}
            setCourseId={setCourseId}
          />
          <UploadVideoStep
            courseId={courseId}
            uploadCourseVideos={uploadCourseVideos}
            onClose={() => {
              reset();
              onOpenChange(false);
            }}
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
}) {
  const { nextStep } = useWizard();

  const onSubmit = async (data) => {
    try {
      const newCourse = await createCourse(data);
      console.log(newCourse);

      setCourseId(newCourse._id);
      console.log(newCourse._id);

      toast.success("Course created successfully!");
      nextStep();
    } catch (err) {
      toast.error("Failed to create course");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 mt-4"
      encType="multipart/form-data"
    >
      {/* Title */}
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          {...register("title", { required: "Title is required" })}
          placeholder="Course title"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          {...register("description", {
            required: "Description is required",
          })}
          placeholder="Course description"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label>Price</Label>
        <Input
          {...register("price", {
            required: "Price is required",
            min: { value: 1, message: "Price must be greater than 0" },
          })}
          type="number"
          placeholder="Price"
          disabled={isSubmitting}
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Input
          {...register("category", {
            required: "Category is required",
          })}
          placeholder="Category"
          disabled={isSubmitting}
        />
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Uploading..." : "Next"}
        </Button>
      </div>
    </form>
  );
}

function UploadVideoStep({ courseId, uploadCourseVideos, onClose }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!courseId) {
      toast.error("Create the course first!");
      return;
    }
    if (!files.length) {
      toast.error("Please select at least one video file");
      return;
    }

    try {
      setIsUploading(true);
      await uploadCourseVideos(courseId, files);
      toast.success("Videos uploaded successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to upload videos");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <div>
        <Label>Upload Video(s)</Label>
        <Input
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => setFiles([...e.target.files])}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={onClose} variant="outline">
          Skip for now
        </Button>
        <Button onClick={handleUpload} disabled={isUploading}>
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading ? "Uploading..." : "Finish"}
        </Button>
      </div>
    </div>
  );
}
