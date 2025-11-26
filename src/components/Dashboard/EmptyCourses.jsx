import React from 'react'

export default function EmptyCourses({ courses }) {
    if (!courses.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-background/60 flex items-center justify-center border border-border shadow-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
                        />
                    </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">No enrolled courses</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    You haven’t enrolled in any course yet.
                </p>
            </div>
        );
    }

}
