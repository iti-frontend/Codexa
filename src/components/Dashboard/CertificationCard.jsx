import { CertificationContent } from "@/Constants/CertifiactionContent";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

function CertificationCard() {
  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left">
          <span className="text-primary">Certifications</span> Earned
        </h2>

        <div className="space-y-6">
          {CertificationContent.map((certificate, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              {/* Mobile & Tablet Layout */}
              <div className="block xl:hidden">
                <div className="relative w-full h-32 sm:h-40">
                  <Image
                    src={"/auth/login.png"}
                    alt={certificate.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">
                      {certificate.TrackName}
                    </h3>
                    <p className="text-sm sm:text-base text-foreground/70">
                      {certificate.title}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="w-full py-2.5 text-sm font-semibold">
                      View
                    </Button>
                    <Button className="w-full bg-primary/20 text-primary hover:text-white py-2.5 text-sm font-semibold">
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden xl:flex items-center p-6">
                <div className="relative w-64 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={"/auth/login.png"}
                    alt={certificate.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 px-8">
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {certificate.TrackName}
                  </h3>
                  <p className="text-base text-foreground/70">
                    {certificate.title}
                  </p>
                </div>
                <div className="flex gap-4 flex-shrink-0">
                  <Button className="w-32 py-2.5 text-sm font-semibold">
                    View
                  </Button>
                  <Button className="w-32 bg-primary/20 text-primary hover:text-white py-2.5 text-sm font-semibold">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CertificationCard;
