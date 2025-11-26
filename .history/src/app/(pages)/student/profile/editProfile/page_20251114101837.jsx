"use client";
import ProfileEditCard from "@/components/Dashboard/ProfileEditCard";

export default function StudentEdit() {
  return <ProfileEditCard editEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/tudents/profile`} />;
}
