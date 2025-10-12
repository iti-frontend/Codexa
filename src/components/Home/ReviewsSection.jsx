import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { reviewsList } from "@/Constants/Home-data";

function ReviewsSection() {
  return (
    <section id="reviews" className="py-14 bg-primary/10">
      <div className="container mx-auto p-6 w-[90%]  lg:w-full">
        <div className="text-center ">
          <h2 className="text-3xl font-bold">
            What Our <span className="text-primary">Learners Say</span>
          </h2>
          <p className="text-muted-foreground py-4">
            Join thousands of successful developers who transformed their
            careers with Codexa
          </p>
        </div>
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 py-4 ">
          {reviewsList.map((review) => (
            <Card
              key={review.name}
              className="w-[90%] mx-auto md:mx-0 md:w-full text-left transition-all hover:shadow-lg hover:scale-102  border-gray-300"
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {review.role} at {review.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
