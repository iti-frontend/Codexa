"use client";

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PiChalkboardTeacher, PiStudent } from "react-icons/pi";
import { useRoleStore } from "@/store/useRoleStore";
import { ArrowLeft } from "lucide-react";

export default function RoleSelect({ children }) {
  const [step, setStep] = useState(1);
  const { role, setRole } = useRoleStore();

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleBack = () => {
    setRole("");
    setStep(1);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <Stepper value={step} className="w-full space-y-6">
        {/* --- Step Navigation --- */}
        <StepperNav>
          {[1, 2].map((s) => (
            <StepperItem key={s} step={s}>
              <StepperTrigger>
                <StepperIndicator>{s}</StepperIndicator>
              </StepperTrigger>
              {s === 1 && (
                <StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
              )}
            </StepperItem>
          ))}
        </StepperNav>

        {/* --- Step Content --- */}
        <StepperPanel>
          {/* Step 1: Role Selection */}
          <StepperContent
            value={1}
            className="flex flex-col items-center justify-center gap-6 w-full"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-xl font-semibold">Choose Your Role</h2>
              <p className="text-muted-foreground text-sm">
                Select how you'll be using the platform
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Button
                variant="outline"
                size={"lg"}
                className="w-full h-12 py-3 text-xl flex-1"
                onClick={() => handleSelectRole("student")}
              >
                <PiStudent />
                <span>Student</span>
              </Button>

              <Button
                variant="outline"
                size={"lg"}
                className={"w-full h-12 py-3 text-xl flex-1"}
                // className="flex items-center justify-center gap-2 border border-border bg-accent cursor-pointer hover:bg-accent/50 duration-300 flex-1 h-24 rounded-md text-xl py-3"
                onClick={() => handleSelectRole("instructor")}
              >
                <PiChalkboardTeacher />
                <span>Instructor</span>
              </Button>
            </div>
          </StepperContent>

          {/* Step 2: Form */}
          <StepperContent
            value={2}
            className="flex flex-col items-center justify-center gap-4 w-full"
          >
            <div className="flex flex-col items-center gap-2 text-center mb-2">
              <h2 className="text-xl font-semibold">
                <span className="capitalize">{role}</span> Registration
              </h2>
              <p className="text-muted-foreground text-sm">
                Fill in your information to get started
              </p>
            </div>

            {children}

            <Button variant="outline" size="lg" onClick={handleBack}>
              <ArrowLeft /> Change role
            </Button>
          </StepperContent>
        </StepperPanel>
      </Stepper>
    </div>
  );
}
