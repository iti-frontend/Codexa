"use client";

import InstructorPerformance from "@/components/Dashboard/InstructorPerformance";
import InstructorsActivity from "@/components/Dashboard/InstructorsActivity";
import QuickLinks from "@/components/Dashboard/QuickLinks";
import RecentActivity from "@/components/Dashboard/RecentActivity";


export default function InstructorDashboard() {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col gap-8 w-[70%]">
        <InstructorPerformance />
        <InstructorsActivity />
      </div>

      <div className="flex flex-col w-[30%]">
        <QuickLinks/>
        <RecentActivity/>

      </div>


    </div>
  );
}
