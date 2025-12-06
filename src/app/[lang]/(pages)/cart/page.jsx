"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, ArrowRight, Tag, Star } from "lucide-react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Cart() {
    const { t } = useTranslation();
    const [cart, setCart] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        fetchCart();
        fetchWishlist();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await api.get("/cart");
            setCart(res.data);
        } catch (error) {
            console.error("Error fetching cart", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        try {
            const res = await api.get("/wishlist");
            setWishlist(res.data?.courses || []);
        } catch (error) {
            console.error("Error fetching wishlist", error);
            setWishlist([]);
        }
    };

    const removeFromCart = async (courseId) => {
        try {
            await api.delete(`/cart/${courseId}`);
            fetchCart();
        } catch {
            alert("Error removing from cart");
        }
    };

    const moveToWishlist = async (courseId) => {
        try {
            await api.post("/wishlist", { courseId });
            await removeFromCart(courseId);
            fetchWishlist();
        } catch (error) {
            console.error("Error moving to wishlist", error);
        }
    };

    const moveToCart = async (courseId) => {
        try {
            await api.post("/cart", { courseId });
            await api.delete(`/wishlist/${courseId}`);
            fetchCart();
            fetchWishlist();
        } catch (error) {
            console.error("Error moving to cart", error);
        }
    };

    const removeFromWishlist = async (courseId) => {
        try {
            await api.delete(`/wishlist/${courseId}`);
            fetchWishlist();
        } catch (error) {
            console.error("Error removing from wishlist", error);
        }
    };

    const handleCheckout = async () => {
        try {
            const res = await api.post("/orders/checkout-session", {});
            window.location.href = res.data.url;
        } catch (error) {
            alert("Checkout failed: " + (error.response?.data?.message || error.message));
        }
    };

    const renderCourseCard = (course, isWishlist = false) => (
        <div
            key={course._id}
            className="flex flex-col md:flex-row gap-4 p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-slideIn"
        >
            {/* Thumbnail */}
            <div className="w-full md:w-[120px] h-[180px] md:h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-primary flex items-center justify-center text-white font-semibold text-sm text-center">
                {course.coverImage?.url ? (
                    <img
                        src={course.coverImage.url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span>{course.title?.substring(0, 20)}</span>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {course.title}
                </h3>

                <p className="text-sm text-gray-600">
                    {t("cart.by")} {course.instructor?.name || course.instructor || "Instructor"}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-amber-600">
                        {course.rating || "5.0"}
                    </span>

                    <div className="flex gap-0.5 text-amber-600">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                    </div>

                    <span className="text-gray-600">
                        ({t("cart.ratings", { count: course.ratingCount || course.studentsCount || 2 })})
                    </span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    <span>
                        {t("cart.totalMins", { count: course.totalDuration || 0 })}
                    </span>
                    <span>• {t("cart.lectures", { count: course.videoCount || 0 })}</span>

                    <span>
                        • <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">
                            {course.level || t("cart.level")}
                        </span>
                    </span>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mt-1">
                    {course.isPremium && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white text-xs font-bold rounded">
                            👑 {t("cart.premium")}
                        </span>
                    )}

                    {course.isBestseller && (
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">
                            {t("cart.bestseller")}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3">
                <span className="text-xl md:text-2xl font-bold text-gray-900">
                    £E{course.price || "399.99"}
                </span>

                <div className="flex md:flex-col items-end gap-2">
                    <button
                        className="text-purple-600 hover:text-primary text-sm font-semibold transition-colors px-0 py-1"
                        onClick={() =>
                            isWishlist
                                ? removeFromWishlist(course._id)
                                : removeFromCart(course._id)
                        }
                    >
                        {t("cart.remove")}
                    </button>

                    {!isWishlist && (
                        <button
                            className="text-purple-600 hover:text-primary transition-colors px-0 py-1"
                            onClick={() => moveToWishlist(course._id)}
                            title={t("cart.saveForLater")}
                        >
                            <Heart className="w-5 h-5 cursor-pointer" />
                        </button>
                    )}

                    {isWishlist && (
                        <button
                            className="text-purple-600 hover:text-primary text-sm font-semibold transition-colors px-0 py-1"
                            onClick={() => moveToCart(course._id)}
                        >
                            {t("cart.moveToCart")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 font-sans">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {t("cart.title")}
                </h1>

                <p className="text-base text-gray-600">
                    {t("cart.itemsCount", { count: cart?.courses?.length || 0 })}
                </p>
            </div>

            {cart && cart.courses?.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Items */}
                    <div className="lg:col-span-2 flex flex-col">
                        {cart.courses.map((course) =>
                            renderCourseCard(course, false)
                        )}

                        {wishlist.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                                    {t("cart.recentWishlist")}
                                </h2>

                                <div className="flex flex-col gap-6">
                                    {wishlist.slice(0, 3).map((course) =>
                                        renderCourseCard(course, true)
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="lg:sticky lg:top-8 bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                        <p className="text-sm text-gray-600 mb-2">
                            {t("cart.total")}:
                        </p>

                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            £E{cart.totalPrice || "0.00"}
                        </h2>

                        <button
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-blue-700 cursor-pointer text-white text-base font-bold rounded-lg"
                            onClick={handleCheckout}
                        >
                            {t("cart.checkout")}
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="text-xs text-gray-600 text-center mt-3">
                            {t("cart.noCharge")}
                        </p>

                        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 mt-4 bg-white hover:bg-gray-50 text-primary text-base font-bold border border-primary rounded-lg">
                            <Tag className="w-4 h-4" />
                            {t("cart.coupon")}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 px-8">
                    <div className="text-7xl mb-4">🛒</div>
                    <p className="text-xl text-gray-600 mb-6">
                        {t("cart.emptyTitle")}
                    </p>

                    <Button
                        className="px-8 py-3.5 bg-primary hover:bg-blue-800 text-white font-bold"
                        onClick={() => router.push("/student/explore")}
                    >
                        {t("cart.browse")}
                    </Button>
                </div>
            )}
        </div>
    );
}
