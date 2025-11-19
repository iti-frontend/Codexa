"use client";

import { useState, useEffect } from "react";

export default function InstructorProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    links: "",
    profileImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper: read a cookie value
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Fetch current profile data (optional)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getCookie("token");
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/instructors/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data?.name || "",
            bio: data?.bio || "",
            links: JSON.stringify(data?.links || []),
            profileImage: null,
          });
          setPreview(data?.profileImage || null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setPreview(URL.createObjectURL(files[0])); // ✅ Preview the image
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = getCookie("token");
    if (!token) {
      setMessage("❌ Token not found in cookies.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    if (formData.name) data.append("name", formData.name);
    if (formData.bio) data.append("bio", formData.bio);
    if (formData.links) data.append("links", formData.links);
    if (formData.profileImage) data.append("profileImage", formData.profileImage);

    try {
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

      if (res.ok) {
        setMessage("✅ Profile updated successfully!");
      } else {
        setMessage(`❌ Error: ${result.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Update Instructor Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter your full name"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1 font-semibold">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Write a short bio"
          />
        </div>

        {/* Links */}
        <div>
          <label className="block mb-1 font-semibold">Links (JSON format)</label>
          <textarea
            name="links"
            value={formData.links}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder='Example: [{"label":"GitHub","url":"https://github.com/you"}]'
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="block mb-1 font-semibold">Profile Image</label>
          <input type="file" name="profileImage" onChange={handleChange} />

          {/* ✅ Image preview */}
          {preview && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img
                src={preview}
                alt="Profile preview"
                className="w-32 h-32 object-cover rounded-full border"
              />
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Status message */}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
