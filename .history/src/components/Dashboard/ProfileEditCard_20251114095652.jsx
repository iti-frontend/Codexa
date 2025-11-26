"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useProfile from "@/hooks/useProfile";

export default function ProfileEditCard({ editEndpoint }) {
  const router = useRouter();
  const { profile, loading } = useProfile();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: null,
    links: [{ label: "", url: "" }],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFormData({
      name: profile.name || "",
      bio: profile.bio || "",
      profileImage: null,
      links: profile.links?.length ? profile.links : [{ label: "", url: "" }],
    });
    if (profile.profileImage) setImagePreview(profile.profileImage);
  }, [profile]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Only images allowed");
    if (file.size > 5 * 1024 * 1024) return toast.error("Max size 5MB");
    setFormData((prev) => ({ ...prev, profileImage: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleLinkChange = (i, field, value) => {
    const updated = [...formData.links];
    updated[i][field] = value;
    setFormData((prev) => ({ ...prev, links: updated }));
  };
  const addLink = () => setFormData((prev) => ({ ...prev, links: [...prev.links, { label: "", url: "" }] }));
  const removeLink = (i) => setFormData((prev) => ({ ...prev, links: prev.links.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1];
      if (!token) return toast.error("Token missing");

      const data = new FormData();
      if (formData.name) data.append("name", formData.name);
      if (formData.bio) data.append("bio", formData.bio);
      const validLinks = formData.links.filter((l) => l.label && l.url);
      if (validLinks.length) data.append("links", JSON.stringify(validLinks));
      if (formData.profileImage) data.append("profileImage", formData.profileImage);

      const res = await fetch(editEndpoint, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: data });
      if (!res.ok) throw new Error("Failed to update");

      // update cookie
      const updated = { ...profile, ...formData, links: validLinks };
      if (imagePreview) updated.profileImage = imagePreview;
      document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(updated))}; path=/; max-age=2592000`;

      toast.success("Profile updated");
      router.push(editEndpoint.replace("/profile", "/profile"));
    } catch (err) {
      console.error(err);
      toast.error("Update error");
    } finally { setSaving(false); }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="min-h-screen py-8 px-4 bg-[#0d1117]">
      <div className="max-w-3xl mx-auto bg-[#161b22] rounded-xl p-8 shadow-md">
        <h1 className="text-3xl text-white font-bold mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div>
            <label className="block text-gray-200 mb-2">Profile Image</label>
            <div className="flex items-center gap-4">
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-gray-400 " />}
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer" />
            </div>
          </div>

          {/* Name & Bio */}
          <label className="block text-gray-200 mb-2">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full px-4 py-2 rounded-md bg-gray-900 text-white" />
          <label className="block text-gray-200 mb-2">About Me</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" rows={4} className="w-full px-4 py-2 rounded-md bg-gray-900 text-white" />

          {/* Links */}
          <div>
            <label className="block text-gray-200 mb-2">Links</label>
            {formData.links.map((link, i) => (
                
              <div key={i} className="flex gap-2 mb-2">
                
                <input type="text" placeholder="Label" value={link.label} onChange={(e) => handleLinkChange(i, "label", e.target.value)} className="flex-1 px-3 py-2 rounded-md bg-gray-800 text-white" />
                <input type="url" placeholder="URL" value={link.url} onChange={(e) => handleLinkChange(i, "url", e.target.value)} className="flex-1 px-3 py-2 rounded-md bg-gray-800 text-white" />
                <button type="button" onClick={() => removeLink(i)} className="bg-red-500 px-3 py-2 rounded-md text-white hover:bg-red-600 cursor-pointer">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addLink} className="text-blue-400 hover:text-blue-500 cursor-pointer">+ Add Link</button>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="flex-1 bg-blue-600 py-3 text-white rounded-md hover:bg-blue-700 cursor-pointer">{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => router.back()} className="flex-1 bg-gray-500 py-3 text-white rounded-md hover:bg-gray-600 cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
