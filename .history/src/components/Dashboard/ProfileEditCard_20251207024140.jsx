"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import useProfile from "@/hooks/useProfile";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import Cookies from "js-cookie";


export default function ProfileEditCard() {
    const { t } = useTranslation();
    const router = useRouter();
    const { profile, loading } = useProfile();

    // ----------- Form State -----------
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        profileImage: null,
        links: [{ label: "", url: "" }],
    });

    // ----------- Image Preview State -----------
    const [imagePreview, setImagePreview] = useState(null);

    // ----------- Saving State -----------
    const [saving, setSaving] = useState(false);

    // ----------- Effect to load profile into form -----------
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

    // ----------- Handle Input Change -----------
    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    // ----------- Handle Image Upload -----------
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error(t('profile.edit.onlyImages'));
        if (file.size > 5 * 1024 * 1024) return toast.error(t('profile.edit.maxSize'));

        setFormData((prev) => ({ ...prev, profileImage: file }));

        // Preview the image
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    // ----------- Handle Links Change -----------
    const handleLinkChange = (i, field, value) => {
        const updated = [...formData.links];
        updated[i][field] = value;
        setFormData((prev) => ({ ...prev, links: updated }));
    };

    // ----------- Add / Remove Links -----------
    const addLink = () =>
        setFormData((prev) => ({ ...prev, links: [...prev.links, { label: "", url: "" }] }));

    const removeLink = (i) =>
        setFormData((prev) => ({ ...prev, links: prev.links.filter((_, idx) => idx !== i) }));

    // ----------- Format Date for Display -----------
    const formatDate = (isoDate) => {
        if (!isoDate) return "-";
        const d = new Date(isoDate);
        return d.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    // ----------- Handle Submit -----------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Get token safely
            const token = Cookies.get("token");
            if (!token) return toast.error(t('profile.edit.tokenMissing'));

            // Read user from cookies
            const userInfo = Cookies.get("userInfo");
            const parsedUser = userInfo ? JSON.parse(userInfo) : null;
            const role = parsedUser?.role?.toLowerCase();

            // Determine correct endpoint
            let endpoint = "";
            if (role === "instructor") {
                endpoint = ENDPOINTS.INSTRUCTOR_EDIT_PROFILE;
            } else if (role === "student") {
                endpoint = ENDPOINTS.STUDENT_EDIT;
            } else if (role === "admin") {
                endpoint = ENDPOINTS.ADMIN_EDIT_PROFILE; // تأكد انه موجود
            } else {
                return toast.error(t('profile.edit.unknownRole'));
            }

            // Prepare FormData
            const data = new FormData();
            data.append("name", formData.name);
            data.append("bio", formData.bio);

            const validLinks = formData.links.filter((l) => l.label && l.url);
            data.append("links", JSON.stringify(validLinks));

            if (formData.profileImage) {
                data.append("profileImage", formData.profileImage);
            }

            // Make request
            const res = await api.put(endpoint, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (!res || !res.data) throw new Error("Invalid response");

            // Determine updated user
            const updatedUser =
                res.data.user ||
                res.data.student ||
                res.data.instructor ||
                res.data.admin ||
                res.data;

            // Save updated user in cookies
            Cookies.set("userInfo", JSON.stringify(updatedUser), {
                expires: 30,
                path: "/",
            });

            toast.success(t('profile.edit.success'));

            // Redirect correctly
            if (role === "admin") {
                router.push("/admin");
            } else {
                router.push("/profile");
            }

        } catch (err) {
            console.error("Update error:", err);
            toast.error(t('profile.edit.failed'));
        } finally {
            setSaving(false);
        }
    };



    if (loading) return <div>{t('profile.edit.loading')}</div>;
    if (!profile) return <div>{t('profile.edit.noProfile')}</div>;

    return (
        <div className="min-h-screen py-8 px-4 bg-[#0d1117]">
            <div className="max-w-3xl mx-auto bg-[#161b22] rounded-xl p-6 sm:p-8 shadow-md">
                {/* ----------- Header ----------- */}
                <h1 className="text-3xl text-white font-bold mb-6 text-center sm:text-left">
                    {t('profile.editProfile')}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ----------- Profile Image ----------- */}
                    <div>
                        <label className="block text-gray-200 mb-2">{t('profile.edit.profileImage')}</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-24 h-24 rounded-full object-cover border border-gray-500 shadow-sm cursor-pointer"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="text-gray-200 file:mx-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-400 file:bg-primary file:text-white  cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* ----------- Name ----------- */}
                    <div>
                        <label className="block text-gray-200 mb-2">{t('profile.edit.name')}</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t('profile.edit.namePlaceholder')}
                            className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* ----------- Bio ----------- */}
                    <div>
                        <label className="block text-gray-200 mb-2">{t('profile.edit.aboutMe')}</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder={t('profile.edit.bioPlaceholder')}
                            rows={4}
                            className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* ----------- Links ----------- */}
                    <div>
                        <label className="block text-gray-200 mb-2">
                            {t('profile.edit.links')} <span className="text-gray-500">{t('profile.edit.linksHint')}</span>
                        </label>
                        {formData.links.map((link, i) => (
                            <div key={i} className="flex flex-col sm:flex-row gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder={t('profile.edit.labelPlaceholder')}
                                    value={link.label}
                                    onChange={(e) => handleLinkChange(i, "label", e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                />
                                <input
                                    type="url"
                                    placeholder={t('profile.edit.urlPlaceholder')}
                                    value={link.url}
                                    onChange={(e) => handleLinkChange(i, "url", e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeLink(i)}
                                    className="bg-red-500 px-3 py-2 rounded-md text-white hover:bg-red-600 cursor-pointer"
                                >
                                    {t('profile.edit.remove')}
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addLink}
                            className="text-blue-400 hover:text-blue-500 cursor-pointer"
                        >
                            {t('profile.edit.addLink')}
                        </button>
                    </div>

                    {/* ----------- Buttons ----------- */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-blue-600 py-3 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                        >
                            {saving ? t('profile.edit.saving') : t('profile.edit.save')}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-500 py-3 text-white rounded-md hover:bg-gray-600 cursor-pointer"
                        >
                            {t('profile.edit.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}