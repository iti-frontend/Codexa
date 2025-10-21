"use client";

import InstructorPerformance from "@/components/Dashboard/InstructorPerformance";
import InstructorsActivity from "@/components/Dashboard/InstructorsActivity";
import QuickLinks from "@/components/Dashboard/QuickLinks";
import RecentActivity from "@/components/Dashboard/RecentActivity";

export default function InstructorDashboard() {
  return (
    <div className="p-5 grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="flex flex-col gap-8 w-full xl:col-span-8">
        <InstructorPerformance />
        <InstructorsActivity />
      </div>

      <div className="flex flex-col gap-8 w-full xl:col-span-4">
        <QuickLinks />
        <RecentActivity />
      </div>
    </div>
  );
}
