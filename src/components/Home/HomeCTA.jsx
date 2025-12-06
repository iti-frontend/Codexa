import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";

function HomeCTA() {
    return (
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                        Ready to Start Your{" "}
                        <span className="text-primary">Learning Journey?</span>
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of students already learning on Codexa. Get access to
                        expert courses, connect with a vibrant community, and achieve your
                        goals.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Button size="lg" className="gap-2" asChild>
                            <Link href="/register">
                                Get Started for Free
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/courses">Browse Courses</Link>
                        </Button>
                    </div>

                    {/* Trust Badge */}
                    <p className="text-sm text-muted-foreground pt-4">
                        No credit card required • Free trial available • Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    );
}

export default HomeCTA;
