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
import { Loader2 } from "lucide-react";
import { useInstructorCourse } from "@/hooks/useInstructorCourse";

export default function CreateCourseDialog({ open, onOpenChange }) {
  const { createCourse, register, handleSubmit, reset, errors, isSubmitting } =
    useInstructorCourse();

  const onSubmit = async (data) => {
    try {
      await createCourse(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>

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
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
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
              {...register("category", { required: "Category is required" })}
              placeholder="Category"
              disabled={isSubmitting}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Video */}
          <div className="space-y-2">
            <Label>Video</Label>
            <Input
              {...register("video", { required: "Please upload a video" })}
              type="file"
              accept="video/*"
              disabled={isSubmitting}
            />
            {errors.video && (
              <p className="text-sm text-red-500">{errors.video.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Uploading..." : "Upload Course"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
