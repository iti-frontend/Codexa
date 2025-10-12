import About from "@/components/Home/About";
import ActionSection from "@/components/Home/ActionSection";
import DescriptionCommunity from "@/components/Home/DescriptionCommunity";
import DescriptionCourses from "@/components/Home/DescriptionCourses";
import Footer from "@/components/Home/Footer";
import HeroSection from "@/components/Home/HeroSection";
import HomeNavbar from "@/components/Home/HomeNavbar";
import ReviewsSection from "@/components/Home/ReviewsSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <HomeNavbar />
      <HeroSection />
      <About />
      <DescriptionCommunity />
      <DescriptionCourses />
      <ReviewsSection />
      <ActionSection />
      <Footer />
    </div>
  );
}
