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
import { useTranslation } from "react-i18next";

export default function CreateCourseDialog({ open, onOpenChange }) {
  const { t } = useTranslation();
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
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    if (!data.coverImage || !data.coverImage.length) {
      toast.error(t("createCourse.errors.coverImageRequired"));
      return;
    }

    try {
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
      toast.success(t("createCourse.toast.courseCreated"));
      nextStep();
    } catch (err) {
      console.error("Failed to create course:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 mt-4"
      encType="multipart/form-data"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t("createCourse.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("createCourse.description")}
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">{t("createCourse.fields.title")} *</Label>
        <Input
          id="title"
          {...register("title", {
            required: t("createCourse.errors.titleRequired"),
            minLength: {
              value: 3,
              message: t("createCourse.errors.titleMinLength"),
            },
          })}
          placeholder={t("createCourse.placeholders.title")}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          {t("createCourse.fields.description")} *
        </Label>
        <Textarea
          id="description"
          {...register("description", {
            required: t("createCourse.errors.descriptionRequired"),
            minLength: {
              value: 10,
              message: t("createCourse.errors.descriptionMinLength"),
            },
          })}
          placeholder={t("createCourse.placeholders.description")}
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
          <Label htmlFor="category">
            {t("createCourse.fields.category")} *
          </Label>
          <Input
            id="category"
            {...register("category", {
              required: t("createCourse.errors.categoryRequired"),
              minLength: {
                value: 2,
                message: t("createCourse.errors.categoryMinLength"),
              },
            })}
            placeholder={t("createCourse.placeholders.category")}
            disabled={isSubmitting}
          />
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">{t("createCourse.fields.price")} *</Label>
          <Input
            id="price"
            type="number"
            {...register("price", {
              required: t("createCourse.errors.priceRequired"),
              min: {
                value: 0,
                message: t("createCourse.errors.priceMin"),
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
          <Label htmlFor="level">{t("createCourse.fields.level")}</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder={t("createCourse.placeholders.level")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">
                {t("createCourse.levels.beginner")}
              </SelectItem>
              <SelectItem value="intermediate">
                {t("createCourse.levels.intermediate")}
              </SelectItem>
              <SelectItem value="advanced">
                {t("createCourse.levels.advanced")}
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t("createCourse.hints.level")}
          </p>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">{t("createCourse.fields.status")}</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className={"w-full"}>
              <SelectValue
                placeholder={t("createCourse.placeholders.status")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                {t("createCourse.status.public")}
              </SelectItem>
              <SelectItem value="private">
                {t("createCourse.status.private")}
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t("createCourse.hints.status")}
          </p>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="space-y-2">
        <Label htmlFor="prerequisites">
          {t("createCourse.fields.prerequisites")}
        </Label>
        <Textarea
          id="prerequisites"
          {...register("prerequisites")}
          placeholder={t("createCourse.placeholders.prerequisites")}
          disabled={isSubmitting}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          {t("createCourse.hints.prerequisites")}
        </p>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label htmlFor="coverImage">
          {t("createCourse.fields.coverImage")} *
        </Label>
        <Input
          id="coverImage"
          type="file"
          {...register("coverImage", {
            required: t("createCourse.errors.coverImageRequired"),
            validate: {
              isImage: (files) => {
                if (!files || !files.length) return true;
                const file = files[0];
                return (
                  file.type.startsWith("image/") ||
                  t("createCourse.errors.imageType")
                );
              },
              maxSize: (files) => {
                if (!files || !files.length) return true;
                const file = files[0];
                return (
                  file.size <= 5 * 1024 * 1024 ||
                  t("createCourse.errors.imageSize")
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
          {t("createCourse.hints.coverImage")}
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-24">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting
            ? t("createCourse.buttons.creating")
            : t("createCourse.buttons.next")}
        </Button>
      </div>
    </form>
  );
}

function UploadVideoStep({ courseId, uploadCourseVideos, onClose }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { previousStep } = useWizard();
  const { t } = useTranslation();

  const handleUpload = async () => {
    if (!courseId) {
      toast.error(t("createCourse.toast.courseCreationFailed"));
      return;
    }

    if (!files.length) {
      toast.info(t("createCourse.toast.noVideos"));
      onClose();
      return;
    }

    try {
      setIsUploading(true);
      await uploadCourseVideos(courseId, files);
      toast.success(t("createCourse.toast.videosUploaded"));
      onClose();
    } catch (err) {
      console.error("Failed to upload videos:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("video/")) {
        toast.error(t("createCourse.errors.notVideoFile", { name: file.name }));
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error(t("createCourse.errors.fileTooLarge", { name: file.name }));
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  return (
    <div className="mt-4 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">
          {t("createCourse.upload.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("createCourse.upload.description")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="videos-upload">
            {t("createCourse.upload.selectFiles")}
          </Label>
          <Input
            id="videos-upload"
            type="file"
            multiple
            accept="video/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground">
            {t("createCourse.upload.hint")}
          </p>
        </div>

        {files.length > 0 && (
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">
              {t("createCourse.upload.selectedFiles", { count: files.length })}
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
            {t("createCourse.buttons.skipNow")}
          </Button>
        </div>
        <Button
          onClick={handleUpload}
          disabled={isUploading || !files.length}
          className="min-w-24"
        >
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading
            ? t("createCourse.buttons.uploading")
            : t("createCourse.buttons.finish")}
        </Button>
      </div>
    </div>
  );
}
