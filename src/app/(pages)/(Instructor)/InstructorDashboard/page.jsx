"use client";

import InstructorPerformance from "@/components/Dashboard/InstructorPerformance";
import InstructorsActivity from "@/components/Dashboard/InstructorsActivity";
import QuickLinks from "@/components/Dashboard/QuickLinks";
import RecentActivity from "@/components/Dashboard/RecentActivity";


export default function InstructorDashboard() {
  return (
    <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <div className="lg:col-span-8 flex flex-col gap-8 w-full">
        <InstructorPerformance />
        <InstructorsActivity />
      </div>

      <div className="lg:col-span-4 flex flex-col gap-8 w-full">
        <QuickLinks/>
        <RecentActivity/>

      </div>


    </div>
  );
}
