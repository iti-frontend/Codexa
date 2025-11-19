"use client";
import ProfileCard from "@/components/Dashboard/ProfileCard";
import useProfile from "@/hooks/useProfile";

export default function StudentProfilePage() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-500 rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-gray-300">
        <p>No profile found</p>
      </div>
    );
  }

  return <ProfileCard profile={profile} editLink="/tudent/profile" />;
}
