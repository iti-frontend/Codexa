// components/CreatePostDialog.js
"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Plus,
  X,
  Link,
  Image,
  FileText,
  BarChart,
  Upload,
  Trash2,
} from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { FormTextarea } from "../ui/FormTextarea";
import { FormSelect } from "../ui/FormSelect";

import { uploadFile } from "@/lib/upload";
import { FormInput } from "../auth/FormInput";

export function CreatePostDialog({ onPostCreated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const { createPost } = useCommunity();

  const form = useForm({
    defaultValues: {
      type: "text",
      content: "",
      image: "",
      linkUrl: "",
      attachments: [],
      poll: { question: "", options: [{ text: "" }, { text: "" }] },
    },
  });

  const watchType = form.watch("type");
  const watchAttachments = form.watch("attachments");
  const watchPollOptions = form.watch("poll.options");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setSelectedImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setSelectedImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImageToServer = async (file) => {
    setUploading(true);
    try {
      // If you have a file upload endpoint
      const imageUrl = await uploadFile(file);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);

      // Fallback: Create a local URL (for demo purposes)
      // In production, you should always upload to your server
      return URL.createObjectURL(file);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Prepare the data based on post type
      const submitData = {
        type: data.type,
        content: data.content,
      };

      // Handle image upload for image posts
      if (data.type === "image") {
        if (selectedImageFile) {
          // Upload the image file
          const imageUrl = await uploadImageToServer(selectedImageFile);
          submitData.image = imageUrl;
        } else if (data.image) {
          // Use provided URL
          submitData.image = data.image;
        } else {
          throw new Error(
            "Please either upload an image or provide an image URL"
          );
        }
      }

      // Add type-specific fields
      if (data.type === "link" && data.linkUrl) {
        submitData.linkUrl = data.linkUrl;
      }

      if (data.type === "poll" && data.poll) {
        submitData.poll = {
          question: data.poll.question,
          options: data.poll.options.filter((opt) => opt.text.trim() !== ""),
        };
      }

      // Add attachments if any
      if (data.attachments && data.attachments.length > 0) {
        submitData.attachments = data.attachments.filter(
          (att) => att.url.trim() !== ""
        );
      }

      console.log("Submitting data:", submitData);
      await createPost(submitData);

      setOpen(false);
      resetForm();

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({
      type: "text",
      content: "",
      image: "",
      linkUrl: "",
      attachments: [],
      poll: { question: "", options: [{ text: "" }, { text: "" }] },
    });
    setSelectedImage(null);
    setSelectedImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addAttachment = () => {
    const currentAttachments = form.getValues("attachments");
    form.setValue("attachments", [
      ...currentAttachments,
      { url: "", type: "image" },
    ]);
  };

  const removeAttachment = (index) => {
    const currentAttachments = form.getValues("attachments");
    form.setValue(
      "attachments",
      currentAttachments.filter((_, i) => i !== index)
    );
  };

  const addPollOption = () => {
    const currentOptions = form.getValues("poll.options");
    form.setValue("poll.options", [...currentOptions, { text: "" }]);
  };

  const removePollOption = (index) => {
    const currentOptions = form.getValues("poll.options");
    if (currentOptions.length > 2) {
      form.setValue(
        "poll.options",
        currentOptions.filter((_, i) => i !== index)
      );
    }
  };

  const handleOpenChange = (open) => {
    if (!open) {
      resetForm();
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Post Type */}
            <FormSelect
              control={form.control}
              name="type"
              label="Post Type"
              options={[
                { value: "text", label: "Text", icon: FileText },
                { value: "image", label: "Image", icon: Image },
                { value: "link", label: "Link", icon: Link },
                { value: "poll", label: "Poll", icon: BarChart },
              ]}
            />

            {/* Content */}
            <FormTextarea
              control={form.control}
              name="content"
              label="Content"
              placeholder="What's on your mind?"
              rows={3}
              rules={{ required: "Content is required" }}
            />

            {/* Image Upload/URL (for image posts) */}
            {watchType === "image" && (
              <div className="space-y-3">
                {/* File Upload */}
                <div>
                  <Label className="font-semibold text-sm">Upload Image</Label>
                  <div className="mt-2">
                    {selectedImage ? (
                      <div className="relative">
                        <img
                          src={selectedImage}
                          alt="Preview"
                          className="w-full max-h-64 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={removeSelectedImage}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload an image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Or use URL */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                <FormInput
                  control={form.control}
                  name="image"
                  label="Image URL (Alternative)"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  rules={{
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Please enter a valid URL",
                    },
                    validate: (value) => {
                      if (!selectedImageFile && !value) {
                        return "Please either upload an image or provide an image URL";
                      }
                      return true;
                    },
                  }}
                />
              </div>
            )}

            {/* Link URL (for link posts) */}
            {watchType === "link" && (
              <FormInput
                control={form.control}
                name="linkUrl"
                label="Link URL"
                type="url"
                placeholder="https://example.com"
                rules={{
                  required: "Link URL is required for link posts",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Please enter a valid URL",
                  },
                }}
              />
            )}

            {/* Poll (for poll posts) */}
            {watchType === "poll" && (
              <div className="space-y-3">
                <FormInput
                  control={form.control}
                  name="poll.question"
                  label="Poll Question"
                  placeholder="Ask a question..."
                  rules={{ required: "Poll question is required" }}
                />

                <div>
                  <Label className="text-sm">Options (minimum 2)</Label>
                  <div className="space-y-2">
                    {watchPollOptions?.map((_, index) => (
                      <div key={index} className="flex gap-2">
                        <FormInput
                          control={form.control}
                          name={`poll.options.${index}.text`}
                          placeholder={`Option ${index + 1}`}
                          rules={{ required: "Option text is required" }}
                        />
                        {watchPollOptions.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removePollOption(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPollOption}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            {/* Attachments (for all post types) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Attachments (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAttachment}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Attachment
                </Button>
              </div>

              {watchAttachments?.map((_, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <FormSelect
                    control={form.control}
                    name={`attachments.${index}.type`}
                    options={[
                      { value: "image", label: "Image" },
                      { value: "video", label: "Video" },
                      { value: "file", label: "File" },
                    ]}
                    className="w-24"
                  />

                  <FormInput
                    control={form.control}
                    name={`attachments.${index}.url`}
                    type="url"
                    placeholder="https://example.com/file"
                    className="flex-1"
                    rules={{
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: "Please enter a valid URL",
                      },
                    }}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploading}>
                {loading
                  ? "Creating..."
                  : uploading
                  ? "Uploading..."
                  : "Create Post"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
