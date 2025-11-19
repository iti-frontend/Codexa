"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InstructorProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    
    // بيانات الفورم
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        profileImage: null,
        links: [{ label: "", url: "" }]
    });

    // معاينة الصورة
    const [imagePreview, setImagePreview] = useState(null);

    // جلب البيانات من الكوكيز
    useEffect(() => {
        try {
            const userInfoCookie = document.cookie
                .split("; ")
                .find(row => row.startsWith("userInfo="))
                ?.split("=")[1];

            if (userInfoCookie) {
                const user = JSON.parse(decodeURIComponent(userInfoCookie));
                setFormData({
                    name: user.name || "",
                    bio: user.bio || "",
                    profileImage: null,
                    links: user.links?.length > 0 ? user.links : [{ label: "", url: "" }]
                });
                if (user.profileImage) {
                    setImagePreview(user.profileImage);
                }
            }
        } catch (error) {
            console.error("Error loading profile from cookies:", error);
        }
    }, []);

    // تغيير النصوص
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // تغيير الصورة
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profileImage: file });
            // معاينة الصورة
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // إضافة رابط جديد
    const addLink = () => {
        setFormData({
            ...formData,
            links: [...formData.links, { label: "", url: "" }]
        });
    };

    // حذف رابط
    const removeLink = (index) => {
        const newLinks = formData.links.filter((_, i) => i !== index);
        setFormData({ ...formData, links: newLinks });
    };

    // تغيير الروابط
    const handleLinkChange = (index, field, value) => {
        const newLinks = [...formData.links];
        newLinks[index][field] = value;
        setFormData({ ...formData, links: newLinks });
    };

    // إرسال الفورم
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const token = document.cookie
                .split("; ")
                .find(row => row.startsWith("token="))
                ?.split("=")[1];

            // تجهيز FormData
            const data = new FormData();
            
            if (formData.name) data.append("name", formData.name);
            if (formData.bio) data.append("bio", formData.bio);
            if (formData.profileImage) data.append("profileImage", formData.profileImage);
            
            // تحويل الروابط لـ JSON
            const validLinks = formData.links.filter(link => link.label && link.url);
            if (validLinks.length > 0) {
                data.append("links", JSON.stringify(validLinks));
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/instructors/profile`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: data
                }
            );

            if (res.ok) {
                setMessage("✅ تم تحديث البيانات بنجاح!");
                
                // تحديث الكوكيز
                const updatedProfile = await res.json();
                if (updatedProfile) {
                    const userInfo = JSON.parse(
                        document.cookie
                            .split("; ")
                            .find(row => row.startsWith("userInfo="))
                            ?.split("=")[1] || "{}"
                    );
                    userInfo.name = updatedProfile.name || userInfo.name;
                    document.cookie = `userInfo=${JSON.stringify(userInfo)}; path=/`;
                }

                setTimeout(() => {
                    router.push("/instructor");
                }, 2000);
            } else {
                const error = await res.json();
                setMessage(`❌ ${error.message || "حدث خطأ"}`);
            }
        } catch (error) {
            setMessage("❌ حدث خطأ في الاتصال");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    تعديل الملف الشخصي
                </h1>

                {message && (
                    <div className={`p-4 rounded mb-6 ${
                        message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* الصورة الشخصية */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            الصورة الشخصية
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
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    {/* الاسم */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            الاسم
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="أدخل اسمك"
                        />
                    </div>

                    {/* النبذة */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            نبذة عنك
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="اكتب نبذة مختصرة عنك..."
                        />
                    </div>

                    {/* الروابط */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            الروابط (GitHub, LinkedIn, etc.)
                        </label>
                        {formData.links.map((link, index) => (
                            <div key={index} className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    placeholder="العنوان (مثال: GitHub)"
                                    value={link.label}
                                    onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="url"
                                    placeholder="الرابط (https://...)"
                                    value={link.url}
                                    onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeLink(index)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    حذف
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addLink}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            + إضافة رابط جديد
                        </button>
                    </div>

                    {/* أزرار الحفظ والإلغاء */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-300"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}