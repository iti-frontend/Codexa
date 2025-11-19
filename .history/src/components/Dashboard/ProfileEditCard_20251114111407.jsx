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
            if (profile.role?.toLowerCase() === "instructor") {
      router.push("/instructor/profile");
    } else {
      router.push("/student/profile");
    }
        } catch (err) {
            console.error(err);
            toast.error("Update error");
        } finally { setSaving(false); }
    };

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>No profile found</div>;

    return (

    );
}
