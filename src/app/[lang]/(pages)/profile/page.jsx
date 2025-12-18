"use client";
import { useTranslation } from "react-i18next";
import ProfileCard from "@/components/Dashboard/ProfileCard";
import useProfile from "@/hooks/useProfile";

export default function ProfileView() {
    const { t } = useTranslation();
    const { profile, loading } = useProfile();

    if (loading) return <div>{t('profile.loading')}</div>;
    if (!profile) return <div>{t('profile.noProfile')}</div>;

    //  NEW unified route:
    return <ProfileCard profile={profile} editLink="/profile/edit" />;
}