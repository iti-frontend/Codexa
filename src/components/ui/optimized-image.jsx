"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * OptimizedImage - An image component with loading skeleton and error fallback
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} fallbackSrc - Fallback image if loading fails
 * @param {string} className - Additional classes for the container
 * @param {string} imageClassName - Additional classes for the image
 * @param {boolean} fill - Use Next.js fill mode
 * @param {number} width - Image width (not needed with fill)
 * @param {number} height - Image height (not needed with fill)
 * @param {string} priority - Load image with priority
 */
export default function OptimizedImage({
    src,
    alt = "",
    fallbackSrc = "/placeholder-image.png",
    className = "",
    imageClassName = "",
    fill = false,
    width,
    height,
    priority = false,
    sizes,
    ...props
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Determine the actual source to use
    const imageSrc = hasError ? fallbackSrc : (src || fallbackSrc);

    // Check if source is valid
    const isValidSrc = imageSrc && imageSrc.length > 0;

    if (!isValidSrc) {
        return (
            <div
                className={cn(
                    "bg-muted flex items-center justify-center",
                    className
                )}
            >
                <span className="text-muted-foreground text-sm">No Image</span>
            </div>
        );
    }

    return (
        <div className={cn("relative overflow-hidden", className)}>
            {/* Loading Skeleton */}
            {isLoading && (
                <div
                    className={cn(
                        "absolute inset-0 bg-muted animate-pulse",
                        "flex items-center justify-center z-10"
                    )}
                >
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Image */}
            <Image
                src={imageSrc}
                alt={alt}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                priority={priority}
                sizes={sizes}
                className={cn(
                    "transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                    imageClassName
                )}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
                {...props}
            />
        </div>
    );
}

/**
 * Simple img tag version with loading state (for external URLs that don't work with next/image)
 */
export function OptimizedImg({
    src,
    alt = "",
    fallbackSrc = "/placeholder-image.png",
    className = "",
    containerClassName = "",
    ...props
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const imageSrc = hasError ? fallbackSrc : (src || fallbackSrc);

    if (!imageSrc) {
        return (
            <div
                className={cn(
                    "bg-muted flex items-center justify-center",
                    containerClassName
                )}
            >
                <span className="text-muted-foreground text-sm">No Image</span>
            </div>
        );
    }

    return (
        <div className={cn("relative overflow-hidden", containerClassName)}>
            {/* Loading Skeleton */}
            {isLoading && (
                <div
                    className={cn(
                        "absolute inset-0 bg-muted animate-pulse",
                        "flex items-center justify-center z-10"
                    )}
                >
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Image */}
            <img
                src={imageSrc}
                alt={alt}
                className={cn(
                    "transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                    className
                )}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
                {...props}
            />
        </div>
    );
}
