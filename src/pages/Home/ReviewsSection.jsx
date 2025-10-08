import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

function ReviewsSection() {
    const reviewsList = [
  {
    name: "Sarah Johnson",
    role: "Full Stack Developer",
    company: "Tech Corp",
    rating: 5,
    text: "Codexa transformed my career! The courses are top-notch and the community is incredibly supportive. I landed my dream job just 6 months after starting.",
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    company: "StartupXYZ",
    rating: 5,
    text: "The interactive discussions and real-world projects helped me build a strong portfolio. The mentorship from experienced developers was invaluable.",
    avatar: "MC"
  },
  {
    name: "Emily Rodriguez",
    role: "Frontend Developer",
    company: "Digital Agency",
    rating: 5,
    text: "Best investment in my education! The platform is user-friendly, courses are well-structured, and the certification boosted my credibility with employers.",
    avatar: "ER"
  },
  {
    name: "David Kumar",
    role: "Data Scientist",
    company: "AI Solutions",
    rating: 5,
    text: "From complete beginner to professional developer - Codexa made it possible. The progress tracking kept me motivated throughout my learning journey.",
    avatar: "DK"
  },
  {
    name: "Jessica Williams",
    role: "Backend Developer",
    company: "CloudTech",
    rating: 5,
    text: "The community aspect sets Codexa apart. I've made valuable connections, learned from peers, and even found collaboration opportunities for side projects.",
    avatar: "JW"
  },
  {
    name: "Alex Thompson",
    role: "Mobile Developer",
    company: "AppStudio",
    rating: 5,
    text: "Excellent learning platform with practical, industry-relevant content. The hands-on approach and project-based learning accelerated my skill development.",
    avatar: "AT"
  }
];
  return (
    <section id="reviews" className='py-14 bg-primary/10'>
<div className="container mx-auto p-6 w-[90%]  lg:w-full">
    <div className="text-center ">
    <h2 className="text-3xl font-bold">What Our <span className='text-primary'>Learners Say</span></h2>
    <p className='text-muted-foreground py-4'>Join thousands of successful developers who transformed their careers with Codexa</p>
</div>
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 py-4 " >
            {reviewsList.map((review) => (
              <Card key={review.name} className="w-[90%] mx-auto md:mx-0 md:w-full text-left transition-all hover:shadow-lg hover:scale-102  border-gray-300">
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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
  )
}

export default ReviewsSection