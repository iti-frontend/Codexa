"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function InstructorProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: null,
    links: [{ label: "", url: "" }],
  });

  // ✅ تحميل بيانات المستخدم من الكوكي
  useEffect(() => {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userInfo="))
        ?.split("=")[1];

      if (!cookie) return;

      const user = JSON.parse(decodeURIComponent(cookie));

      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        profileImage: null,
        links: user.links?.length ? user.links : [{ label: "", url: "" }],
      });

      if (user.profileImage) setImagePreview(user.profileImage);
    } catch (err) {
      console.error("Error parsing user cookie:", err);
    }
  }, []);

  // ✅ تحديث الحقول النصية
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ✅ اختيار صورة وتهيئتها
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file only");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size too large (max 5MB)");
      return;
    }

    setFormData((prev) => ({ ...prev, profileImage: file }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ✅ إدارة اللينكات
  const addLink = () =>
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { label: "", url: "" }],
    }));

  const removeLink = (i) =>
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, idx) => idx !== i),
    }));

  const handleLinkChange = (i, field, value) =>
    setFormData((prev) => {
      const updated = [...prev.links];
      updated[i][field] = value;
      return { ...prev, links: updated };
    });

  // ✅ حفظ التعديلات
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = document.cookie
        .split("; ")
        .find((r) => r.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        toast.error("Token not found. Please log in again.");
        return;
      }

      // إعداد البيانات للإرسال
      const data = new FormData();
      if (formData.name) data.append("name", formData.name);
      if (formData.bio) data.append("bio", formData.bio);

      const validLinks = formData.links.filter((l) => l.label && l.url);
      if (validLinks.length) data.append("links", JSON.stringify(validLinks));
      if (formData.profileImage)
        data.append("profileImage", formData.profileImage);

      // إرسال الطلب
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/instructors/profile`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        try {
          const err = JSON.parse(text);
          toast.error(err.message || "Failed to update profile");
        } catch {
          toast.error(`Error ${res.status}: Failed to update profile`);
        }
        return;
      }

      // ✅ تحديث الكوكي بعد التعديل
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userInfo="))
        ?.split("=")[1];

      if (cookie) {
        const user = JSON.parse(decodeURIComponent(cookie));
        user.name = formData.name;
        user.bio = formData.bio;
        user.links = validLinks;
        if (imagePreview) user.profileImage = imagePreview;
        user.updatedAt = new Date().toISOString();

        document.cookie = `userInfo=${encodeURIComponent(
          JSON.stringify(user)
        )}; path=/; max-age=2592000`;
      }

      toast.success("Profile updated successfully");
      setTimeout(() => router.push("/instructor/profile/view"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ واجهة المستخدم
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* الصورة */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Profile Image
            </label>
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
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* الاسم */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-50 text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your name"
            />
          </div>

          {/* السيرة الذاتية */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-50 text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Write a short bio about yourself..."
            />
          </div>

          {/* اللينكات */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Links (GitHub, LinkedIn, etc.)
            </label>
            {formData.links.map((link, i) => (
              <div key={i} className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Label (e.g., GitHub)"
                  value={link.label}
                  onChange={(e) =>
                    handleLinkChange(i, "label", e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-400 rounded-md bg-gray-50"
                />
                <input
                  type="url"
                  placeholder="URL (https://...)"
                  value={link.url}
                  onChange={(e) => handleLinkChange(i, "url", e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-400 rounded-md bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add new link
            </button>
          </div>

          {/* الأزرار */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
