"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function InstructorProfile() {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: null,
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const data = new FormData();
      if (formData.name) data.append("name", formData.name);
      if (formData.bio) data.append("bio", formData.bio);
      if (formData.profileImage) data.append("profileImage", formData.profileImage);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/instructors/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to update profile");

      toast.success("Profile updated successfully 🎉");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 flex flex-col gap-4"
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        className="border p-2 rounded"
        value={formData.name}
        onChange={handleChange}
      />

      <textarea
        name="bio"
        placeholder="Bio"
        className="border p-2 rounded"
        value={formData.bio}
        onChange={handleChange}
      />

      <input
        type="file"
        name="profileImage"
        accept="image/*"
        onChange={handleChange}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
