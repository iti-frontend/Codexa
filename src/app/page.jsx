import HomeCourses from "@/components/Home/HomeCourses";
import HomeFeatures from "@/components/Home/HomeFeatures";
import HomeHero from "@/components/Home/HomeHero";
import HomeNavbar from "@/components/Home/HomeNavbar";

export default function Home() {
  return (
    <>
      <HomeNavbar />
      <HomeHero />
      <HomeFeatures />
      <HomeCourses />
    </>
  );
}
