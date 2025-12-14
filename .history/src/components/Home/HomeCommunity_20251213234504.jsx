"use client";

import { useTranslation } from "react-i18next";
import { communityData } from "@/Constants/Home-data";
import HomeHeading from "./HomeHeading";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function HomeCommunity() {
    const { t } = useTranslation();

    return (
        <section
            className="flex flex-col items-center justify-center py-16 bg-muted/30"
            id="community"
        >
            <HomeHeading
                titleKey="home.community.sectionTitle"
                descKey="home.community.sectionDesc"
            />
            <main className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-8 mt-5">
                {communityData.map((item, index) => (
                    <CommunityCard
                        key={index}
                        icon={item.icon}
                        translationKey={item.translationKey}
                    />
                ))}
            </main>
        </section>
    );
}

export default HomeCommunity;

function CommunityCard({ icon: Icon, translationKey }) {
    const { t } = useTranslation();

    return (
        <Card className="max-w-xs gap-2 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group hover:border-primary/30">
            <CardHeader>
                <div className="bg-primary p-3 w-fit rounded-full text-white shadow shadow-primary">
                    <Icon size={20} />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <h3 className="text-xl font-bold text-card-foreground">
                    {t(`home.community.${translationKey}.title`)}
                </h3>
                <p className="text-muted-foreground line-clamp-3">
                    {t(`home.community.${translationKey}.description`)}
                </p>
            </CardContent>
        </Card>
    );
}