"use client";
import ProfileCard from "@/components/Dashboard/ProfileCard";
import useProfile from "@/hooks/useProfile";

export default function InstructorProfileView() {
  const { profile, loading } = useProfile();
  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;
  return <ProfileCard profile={profile} editLink="/instructor/pro/edit" />;
}
