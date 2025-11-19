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
            // تحقق من نوع الملف
            if (!file.type.startsWith('image/')) {
                setMessage("❌ يرجى اختيار صورة فقط");
                return;
            }
            
            // تحقق من حجم الملف (أقل من 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setMessage("❌ حجم الصورة كبير جداً (الحد الأقصى 5MB)");
                return;
            }

            console.log("Image selected:", {
                name: file.name,
                type: file.type,
                size: `${(file.size / 1024).toFixed(2)} KB`
            });

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

            if (!token) {
                setMessage("❌ لم يتم العثور على token. يرجى تسجيل الدخول مرة أخرى");
                setLoading(false);
                return;
            }

            // تجهيز البيانات
            const requestData = {};
            
            if (formData.name) requestData.name = formData.name;
            if (formData.bio) requestData.bio = formData.bio;
            
            // تحويل الروابط
            const validLinks = formData.links.filter(link => link.label && link.url);
            if (validLinks.length > 0) {
                requestData.links = validLinks;
            }

            // تحويل الصورة لـ base64
            if (formData.profileImage) {
                try {
                    const base64 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(formData.profileImage);
                    });
                    requestData.profileImage = base64;
                    console.log("Image converted to base64");
                } catch (err) {
                    console.error("Error converting image:", err);
                    setMessage("❌ خطأ في معالجة الصورة");
                    setLoading(false);
                    return;
                }
            }

            // طباعة البيانات
            console.log("=== Sending Data (JSON) ===");
            console.log("Name:", requestData.name);
            console.log("Bio:", requestData.bio);
            console.log("Links:", requestData.links);
            console.log("Has Image:", !!requestData.profileImage);
            console.log("API URL:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/instructors/profile`);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/instructors/profile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(requestData)
                }
            );

            // طباعة الـ Response
            const contentType = res.headers.get("content-type");
            console.log("=== Response ===");
            console.log("Status:", res.status);
            console.log("Status Text:", res.statusText);
            console.log("Content-Type:", contentType);

            if (res.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const updatedProfile = await res.json();
                    console.log("Updated profile from server:", updatedProfile);
                    
                    setMessage("✅ Profile updated successfully!");
                    
                    // Update cookies with ALL new data
                    try {
                        const userInfoCookie = document.cookie
                            .split("; ")
                            .find(row => row.startsWith("userInfo="))
                            ?.split("=")[1];
                        
                        if (userInfoCookie) {
                            const userInfo = JSON.parse(decodeURIComponent(userInfoCookie));
                            
                            // Update all fields
                            if (updatedProfile.name) userInfo.name = updatedProfile.name;
                            if (updatedProfile.bio !== undefined) userInfo.bio = updatedProfile.bio;
                            if (updatedProfile.links) userInfo.links = updatedProfile.links;
                            if (updatedProfile.profileImage) userInfo.profileImage = updatedProfile.profileImage;
                            
                            // Save updated cookie
                            document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(userInfo))}; path=/; max-age=2592000`;
                            console.log("Cookie updated successfully");
                        }
                    } catch (err) {
                        console.error("Error updating cookie:", err);
                    }

                    setTimeout(() => {
                        router.push("/instructor/profile/view");
                    }, 1500);
                } else {
                    const text = await res.text();
                    console.error("Response is not JSON:", text);
                    setMessage("✅ Saved (no confirmation from server)");
                    
                    // Still redirect after delay
                    setTimeout(() => {
                        router.push("/instructor/profile/view");
                    }, 1500);
                }
            } else {
                const text = await res.text();
                console.error("=== Error Response ===");
                console.error(text);
                
                try {
                    const error = JSON.parse(text);
                    setMessage(`❌ ${error.message || "حدث خطأ"}`);
                } catch {
                    setMessage(`❌ خطأ ${res.status}: فشل في تحديث البيانات. تحقق من الـ Console`);
                }
            }
        } catch (error) {
            setMessage("❌ حدث خطأ في الاتصال");
            console.error("=== Fetch Error ===");
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