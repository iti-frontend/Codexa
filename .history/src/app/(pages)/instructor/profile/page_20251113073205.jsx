"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InstructorProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: null,
    links: [{ label: "", url: "" }],
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Load profile from cookies
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
          setImagePreview(user.profileImage);
        }
      }
    } catch (error) {
      console.error("Error loading profile from cookies:", error);
    }
  }, []);

  // Handle text input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage("❌ Please select an image file only.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage("❌ Image size is too large (max 5MB).");
        return;
      }

      console.log("Image selected:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      });

      setFormData({ ...formData, profileImage: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new link
  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { label: "", url: "" }],
    });
  };

  // Remove link
  const removeLink = (index) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: newLinks });
  };

  // Handle link input
  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        setMessage("❌ Token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const requestData = {};
      if (formData.name) requestData.name = formData.name;
      if (formData.bio) requestData.bio = formData.bio;

      const validLinks = formData.links.filter((link) => link.label && link.url);
      if (validLinks.length > 0) requestData.links = validLinks;

      if (formData.profileImage) {
        try {
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(formData.profileImage);
          });
          requestData.profileImage = base64;
        } catch (err) {
          console.error("Error converting image:", err);
          setMessage("❌ Image processing error.");
          setLoading(false);
          return;
        }
      }

      console.log("=== Sending Data ===", requestData);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/instructors/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      const contentType = res.headers.get("content-type");
      console.log("Response:", res.status, res.statusText);

      if (res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const updatedProfile = await res.json();
          setMessage("✅ Profile updated successfully!");

          const userInfoCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userInfo="))
            ?.split("=")[1];

          if (userInfoCookie) {
            const userInfo = JSON.parse(decodeURIComponent(userInfoCookie));
            userInfo.name = updatedProfile.name || userInfo.name;
            userInfo.bio = updatedProfile.bio || userInfo.bio;
            userInfo.links = updatedProfile.links || userInfo.links;
            if (updatedProfile.profileImage) {
              userInfo.profileImage = updatedProfile.profileImage;
            }
            document.cookie = `userInfo=${encodeURIComponent(
              JSON.stringify(userInfo)
            )}; path=/; max-age=2592000`;
          }

          setTimeout(() => {
            router.push("/instructor/profile/view");
          }, 1500);
        } else {
          setMessage("✅ Saved (server did not return JSON).");
        }
      } else {
        const text = await res.text();
        console.error("Error:", text);
        setMessage(`❌ Failed: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setMessage("❌ Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Edit Instructor Profile
        </h1>

        {message && (
          <div
            className={`p-4 rounded mb-6 ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
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
                className="block w-full text-sm text-gray-800 
                  file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
                  file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
                  hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-md 
                text-gray-900 bg-gray-50 focus:bg-white 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-400 rounded-md 
                text-gray-900 bg-gray-50 focus:bg-white 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write a short bio about yourself..."
            />
          </div>

          {/* Links */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Links (GitHub, LinkedIn, etc.)
            </label>
            {formData.links.map((link, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Label (e.g. GitHub)"
                  value={link.label}
                  onChange={(e) =>
                    handleLinkChange(index, "label", e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-400 rounded-md 
                    text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="URL (https://...)"
                  value={link.url}
                  onChange={(e) =>
                    handleLinkChange(index, "url", e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-400 rounded-md 
                    text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
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

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
