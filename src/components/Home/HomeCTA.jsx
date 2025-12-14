"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
function HomeCTA() {
    const { t } = useTranslation();
    return (
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                        {t("home.cta.ready")}{" "}
                        <span className="text-primary"> {t("home.cta.learningJourney")}</span>
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t("home.cta.description")}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Button size="lg" className="gap-2" asChild>
                            <Link href="/register">
                               {t("home.cta.getStarted")} <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/courses">{t("home.cta.browseCourses")}</Link>
                        </Button>
                    </div>

                    {/* Trust Badge */}
                    <p className="text-sm text-muted-foreground pt-4">
                         {t("home.cta.trustBadge")}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default HomeCTA;
