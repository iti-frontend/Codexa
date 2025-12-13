"use client";

import { testimonialsData } from "@/Constants/Home-data";
import HomeHeading from "./HomeHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
function HomeTestimonials() {
    const { t } = useTranslation();
  return (
    <section
      className="flex flex-col items-center justify-center py-16 bg-muted/30"
      id="testimonials"
    >
      <HomeHeading
        titleKey="home.testimonials.sectionTitle"
        descKey="home.testimonials.sectionDesc"
      />
      <main className="flex flex-col md:flex-row items-stretch justify-center flex-wrap gap-8 mt-8 max-w-6xl px-4">
        {testimonialsData.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </main>
    </section>
  );
}

export default HomeTestimonials;

function TestimonialCard({ name, role, image, rating, translationKey }) {
  const { t } = useTranslation();
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="max-w-sm flex-1 shadow-lg rounded-2xl hover:shadow-xl transition-shadow relative">
      <CardContent className="pt-6 space-y-5">
  {/* Stars */}
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating
            ? "text-yellow-500 fill-yellow-500"
            : "text-muted-foreground/30"
        }
      />
    ))}
  </div>

  {/* Quote */}
  <div className="relative">
    <Quote
      size={48}
      className="absolute -top-4 -left-2 text-primary/10"
    />
    <p
      className="text-muted-foreground italic leading-relaxed text-sm md:text-base"
      dir="auto"
    >
      {t(`home.testimonials.${translationKey}`)}
    </p>
  </div>

    </Card>
  );
}
