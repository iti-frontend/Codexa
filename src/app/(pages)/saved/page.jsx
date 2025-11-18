"use client";
import { useFavourites } from "@/hooks/useFavourites";
import { useState, useEffect } from "react";

export default function Saved() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const { getFavourites } = useFavourites();

  const loadFavourites = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getFavourites(page, pagination.limit);

      setFavourites(data.items);
      setPagination({
        page: data.page,
        limit: data.pageSize,
        total: data.total,
      });
    } catch (error) {
      console.error("Failed to load favourites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavourites();
  }, []);

  if (loading) {
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
            <div key={fav._id} className="border rounded-lg p-4 shadow-sm">
              <img
                src={fav.course.coverImage?.url || "/auth/login.png"}
                alt={fav.course.title}
                className="w-full h-40 object-cover rounded mb-3"
                onError={(e) => {
                  e.target.src = "/auth/login.png";
                }}
              />
              <h3 className="font-semibold text-lg mb-2">{fav.course.title}</h3>
              <p className="text-gray-600 mb-2">
                Price: {fav.course.price} EGP
              </p>
              <p className="text-sm text-gray-500">Level: {fav.course.level}</p>
              <p className="text-sm text-gray-500">
                Added: {new Date(fav.createdAt).toLocaleDateString("en-US")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => loadFavourites(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            onClick={() => loadFavourites(pagination.page + 1)}
            disabled={
              pagination.page >= Math.ceil(pagination.total / pagination.limit)
            }
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
