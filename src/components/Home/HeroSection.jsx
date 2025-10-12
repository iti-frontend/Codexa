"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const images = [
  "/Home_Images/image1.jpg",
  "/Home_Images/image2.jpg",
  "/Home_Images/image3.jpg",
  "/Home_Images/image4.jpg",
  "/Home_Images/image5.jpg",
  "/Home_Images/image6.jpg",
  "/Home_Images/image7.jpg",
  "/Home_Images/image8.jpg",
];

function HeroSection() {
  return (
    <section className="py-14 font-inter bg-primary/10">
      <div className="container mx-auto">
        <div className="w-[75%] mx-auto ">
          <h1 className="text-2xl md:text-5xl font-bold leading-tight text-gray-900 text-center  mx-auto">
            Learn, Share, and Start Your Coding Journey with{" "}
            <span className="text-primary">Codexa</span>
          </h1>
        </div>
        <div>
          <section className="relative pt-3  mx-auto md:mx-0 md:w-full h-[200px] flex items-end justify-center overflow-hidden ">
            <div className="relative w-[700px] ">
              {images.map((src, index) => {
                const total = images.length;

                const angleStep = 180 / (total - 0.5);

                const angle = angleStep * index;

                const radians = (angle * Math.PI) / 180;

                const radius = 250;

                const x = Math.cos(radians) * radius;
                const y = Math.sin(radians) * radius;

                return (
                  <motion.img
                    key={index}
                    src={src}
                    alt={`img-${index}`}
                    className="absolute w-30 h-30 object-cover rounded-2xl shadow-xl border-2 border-primary"
                    style={{
                      left: `calc(50% + ${x}px - 56px)`,
                      bottom: `${y * 0.3}px`,
                    }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  />
                );
              })}
            </div>
          </section>
          <div className="w-[70%] mx-auto">
            <p className="text-lg text-muted-foreground py-2.5 text-center">
              Everything you need to learn coding and join an active developer
              community. Explore hundreds of courses and connect with thousands
              of coders worldwide.
            </p>
            <div className="text-center py-3.5 flex flex-col gap-4 md:flex-row justify-center ">
              <Button
                className="bg-primary py-5 text-secondary text-lg hover:scale-102  hover:transition-all"
                size={"lg"}
              >
                Start Learning Free <ArrowRight />
              </Button>
              <Button
                size={"lg"}
                className="text-primary py-5 border border-primary bg-secondary hover:scale-102  transition-all hover:bg-white text-lg"
              >
                Explore Community
              </Button>
            </div>
            <div className="flex justify-evenly py-4">
              <div className="flex flex-col  items-center">
                <span className="text-primary font-bold text-2xl">50K+</span>
                <span className="text-muted-foreground">Active Learners</span>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <span className="text-primary font-bold text-2xl">1000+</span>
                <span className="text-muted-foreground">Courses</span>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <span className="text-primary font-bold text-2xl">500+</span>
                <span className="text-muted-foreground">Companies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
