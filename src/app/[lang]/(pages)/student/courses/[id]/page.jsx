"use client";

import { useEffect, useState } from "react";
import { useStudentCourses } from "@/hooks/useStudentCourses";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  PlayCircle,
  BookOpen,
  Video,
  User,
  Clock,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function StudentCourseDetails() {
  const { id, lang } = useParams();
  const { fetchCourseById } = useStudentCourses();
  const { t } = useTranslation();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // ---------------------- Fetch Course ----------------------
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetchCourseById(id)
      .then((data) => setCourse(data))
      .finally(() => setLoading(false));
  }, [id]);

  // ---------------------- Loading State ----------------------
  if (loading)
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );

  if (!course)
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
        {t("courseDetails.courseNotFound")}
      </div>
    );

  // ---------------------- Render ----------------------
  return (
    <div className="min-h-screen bg-background pb-10">
      <HeaderSection course={course} />

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <CoverImageSection
          cover={course.coverImage?.url}
          title={course.title}
        />

        <StatsSection course={course} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <DescriptionSection description={course.description} />
            {/* Future: progress, notes, quizzes */}
          </div>

          <InstructorCard instructor={course.instructor} />
        </div>

        <VideosSection videos={course.videos} onPlay={setSelectedVideo} />

        {selectedVideo && (
          <VideoPlayer
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </div>
    </div>
  );
}

/* ----------------------- HEADER ----------------------- */
function HeaderSection({ course }) {
  return (
    <div className="bg-card border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <div className="flex gap-3 mt-1">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge>{course.level}</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- COVER IMAGE --------------------- */
function CoverImageSection({ cover, title }) {
  return (
    <div className="relative w-full h-72 rounded-xl overflow-hidden border shadow">
      {cover ? (
        <Image src={cover} alt={title} fill className="object-cover" />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">No cover image</p>
        </div>
      )}
    </div>
  );
}

function StatsSection({ course }) {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("courseDetails.stats.price"),
      value: `$${course.price}`,
      icon: DollarSign,
    },
    {
      label: t("courseDetails.stats.videos"),
      value: `${course.videos?.length || 0}`,
      icon: Video,
    },
    {
      label: t("courseDetails.stats.category"),
      value: course.category,
      icon: BookOpen,
    },
    { label: t("courseDetails.stats.level"), value: course.level, icon: Clock },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="border rounded-xl p-4 bg-card shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-bold">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------- DESCRIPTION --------------------- */
function DescriptionSection({ description }) {
  const { t } = useTranslation();

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-3">
        {t("courseDetails.description")}
      </h2>
      <p className="text-muted-foreground leading-relaxed">
        {description || t("courseDetails.noDescription")}
      </p>
    </div>
  );
}

/* --------------------- INSTRUCTOR --------------------- */
function InstructorCard({ instructor }) {
  if (!instructor) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full overflow-hidden border">
        <Image
          src={instructor.profileImage}
          alt={instructor.name}
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </div>

      <div>
        <p className="font-semibold">{instructor.name}</p>
        <p className="text-xs text-muted-foreground">{instructor.email}</p>
      </div>
    </div>
  );
}

/* ------------------------ VIDEOS ---------------------- */
function VideosSection({ videos, onPlay }) {
  const { t } = useTranslation();

  // Filter out null/undefined videos
  const validVideos = videos?.filter((video) => video && video._id) || [];

  if (validVideos.length === 0)
    return (
      <div className="border rounded-xl p-10 text-center">
        <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{t("courseDetails.noVideos")}</p>
      </div>
    );

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Video className="w-5 h-5 text-primary" />{" "}
        {t("courseDetails.courseContent")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {validVideos.map((video, i) => (
          <div
            key={video._id}
            className="border rounded-xl overflow-hidden shadow-sm group"
          >
            <div className="relative aspect-video bg-muted">
              {video.url ? (
                <video src={video.url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="w-12 h-12 text-muted-foreground" />
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                <Button
                  size="icon"
                  className="rounded-full"
                  onClick={() => onPlay(video)}
                >
                  <PlayCircle className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="p-3">
              <p className="font-semibold text-sm truncate">
                {video.title || `${t("courseDetails.lesson")} ${i + 1}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------- PLAYER ----------------------- */
function VideoPlayer({ video, onClose }) {
  const { t } = useTranslation();

  // Add a safety check
  if (!video) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-4 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{video.title || "Video"}</h3>
          <Button variant="ghost" onClick={onClose}>
            {t("courseDetails.close")}
          </Button>
        </div>

        <div className="w-full h-[500px] md:h-[450px] lg:h-[420px] flex items-center justify-center bg-black rounded-lg overflow-hidden">
          {video.url ? (
            <video
              src={video.url}
              controls
              autoPlay
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-white">
              {t("courseDetails.videoNotAvailable")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
