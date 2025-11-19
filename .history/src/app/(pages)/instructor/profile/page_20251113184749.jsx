"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function InstructorProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: null, // File
    links: [{ label: "", url: "" }],
  });

  const [imagePreview, setImagePreview] = useState(null); // URL
  const [imageUrl, setImageUrl] = useState(null); // URL المخزن في الكوكيز

  // تحميل البيانات من الكوكيز عند أول مرة
  useEffect(() => {
    try {
      const userInfoCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userInfo="))
        ?.split("=")[1];

      if (userInfoCookie) {
        const user = JSON.parse(decodeURIComponent(userInfoCookie));
        setFormData({
          name: user.name || "",
          bio: user.bio || "",
          profileImage: null,
          links: user.links?.length > 0 ? user.links : [{ label: "", url: "" }],
        });
        if (user.profileImage) {
          setImagePreview(user.profileImage); // للعرض
          setImageUrl(user.profileImage); // URL المخزن
        }
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  }, []);

  // التعامل مع تغيير الصورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file only");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size too large (max 5MB)");
      return;
    }

    setFormData({ ...formData, profileImage: file });
    setImagePreview(URL.createObjectURL(file)); // عرض مؤقت للصورة الجديدة
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { label: "", url: "" }],
    });
  };

  const removeLink = (index) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: newLinks });
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  // حفظ البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        toast.error("Token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const data = new FormData();
      if (formData.name) data.append("name", formData.name);
      if (formData.bio) data.append("bio", formData.bio);

      const validLinks = formData.links.filter((link) => link.label && link.url);
      if (validLinks.length > 0) data.append("links", JSON.stringify(validLinks));

      // أرسل الصورة فقط لو تم رفعها حديثاً
      if (formData.profileImage) data.append("profileImage", formData.profileImage);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/instructors/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        toast.success("Profile updated successfully");

        // تحديث الكوكيز
        try {
          const userInfoCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userInfo="))
            ?.split("=")[1];

          if (userInfoCookie) {
            const userInfo = JSON.parse(decodeURIComponent(userInfoCookie));

            if (formData.name) userInfo.name = formData.name;
            if (formData.bio !== undefined) userInfo.bio = formData.bio;
            if (validLinks.length > 0) userInfo.links = validLinks;
            if (formData.profileImage && imagePreview) userInfo.profileImage = imagePreview; // URL العرض المؤقت
            else if (!formData.profileImage) userInfo.profileImage = imageUrl; // احتفظ بالـ URL القديم

            document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(userInfo))}; path=/; max-age=2592000`;
          }
        } catch (err) {
          console.error("Error updating cookie:", err);
        }

        setTimeout(() => {
          router.push("/instructor/profile/view");
        }, 1500);
      } else {
        const text = await res.text();
        try {
          const error = JSON.parse(text);
          toast.error(error.message || "An error occurred while updating");
        } catch {
          toast.error(`Error ${res.status}: Failed to update profile`);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Profile Image</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm t
