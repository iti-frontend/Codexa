'use client';

import { useEffect } from "react";

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error("Error caught by boundary:", error);
    }, [error]);

    return (
        <div className="h-screen flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl font-bold text-red-600">Something went wrong </h1>
            <p className="text-red-500 mt-2">{error.message}</p>

            <button
                onClick={() => reset()} 
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-500 transition"
            >
                Try again
            </button>
        </div>
    );
}
