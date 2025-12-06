import HomeCourses from "@/components/Home/HomeCourses";
import HomeFeatures from "@/components/Home/HomeFeatures";
import HomeHero from "@/components/Home/HomeHero";
import HomeNavbar from "@/components/Home/HomeNavbar";
import HomeCommunity from "@/components/Home/HomeCommunity";
import HomeStats from "@/components/Home/HomeStats";
import HomeTestimonials from "@/components/Home/HomeTestimonials";
import HomeCTA from "@/components/Home/HomeCTA";
import HomeFooter from "@/components/Home/HomeFooter";

export default function Home() {
  return (
    <>
      <HomeNavbar />
      <HomeHero />
      <HomeFeatures />
      <HomeCourses />
      <HomeCommunity />
      <HomeStats />
      <HomeTestimonials />
      <HomeCTA />
      <HomeFooter />
    </>
  );
}
