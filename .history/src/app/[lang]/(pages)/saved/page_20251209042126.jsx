"use client";
import { useState, useEffect } from "react";
import { useFavouritesStore } from "@/store/useFavouritesStore";
import Link from "next/link";

export default function Saved() {
  const [loading, setLoading] = useState(true);

  const {
    favourites,
    loading: storeLoading,
    initialized,
    initializeFavourites,
  } = useFavouritesStore();

  useEffect(() => {
    if (!initialized) {
      initializeFavourites();
    }
    setLoading(false);
  }, [initialized, initializeFavourites]);

  if (loading || storeLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Saved Courses</h1>

      {favourites.length === 0 ? (
        <div className="text-center py-8">
          <p>No saved courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favourites.map((fav) => (
            <Link
              href={`student/explore/${fav.course?._id}`}
              key={fav._id}
              className="border rounded-lg p-4 shadow-sm"
            >
              {/* Course Image - Handle null case */}
              <div className="w-full h-40 bg-gray-200 rounded mb-3 flex items-center justify-center">
                <img
                  src={fav.course?.coverImage.url || "/auth/login.png"}
                  alt={fav.course?.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <h3 className="font-semibold text-lg mb-2">
                {fav.course?.title}
              </h3>
              <p className="text-gray-600 mb-2">
                Price: {fav.course?.price} EGP
              </p>
              <p className="text-sm text-gray-500 capitalize mb-1">
                Level: {fav.course?.level}
              </p>
              <p className="text-sm text-gray-500 capitalize mb-1">
                Status: {fav.course?.status}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Videos: {fav.course?.videos?.length || 0}
              </p>
              <p className="text-sm text-gray-500">
                Saved: {new Date(fav.createdAt).toLocaleDateString("en-US")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
