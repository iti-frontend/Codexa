import { CertificationContent } from "@/Constants/CertifiactionContent";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

function CertificationCard() {
    return (
        <div className="p-5 flex flex-col gap-6">
            <h2 className="mb-3 text-2xl font-bold"><span className="text-primary">Certifications</span> Earned</h2>
            {CertificationContent.map((certificate, index) => (
                <div
                    key={index}
                    className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border pb-5"
                >
                    {/*  Image */}
                    <div className="relative w-full md:w-64 h-20 rounded-xl overflow-hidden ">
                        <Image
                            src={"/auth/login.png"}
                            alt={certificate.title}
                            fill
                            className="object-cover cursor-pointer transition-all hover:scale-105"
                        />
                    </div>

                    {/*  title + description */}
                    <div className="flex flex-col justify-center flex-1 text-center md:text-left">
                        <h2 className="text-lg md:text-xl font-bold text-primary mb-2">
                            {certificate.TrackName}
                        </h2>
                        <p className="text-sm  text-foreground/70">{certificate.title}</p>
                    </div>

                    {/*  Buttons */}
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <Button className="transition-all  py-2 px-4 text-sm font-semibold w-full md:w-32">
                            View
                        </Button>
                        <Button className="bg-primary/20 text-primary hover:text-white transition-all  py-2 px-4 text-sm font-semibold w-full md:w-32">
                            Download
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CertificationCard;
