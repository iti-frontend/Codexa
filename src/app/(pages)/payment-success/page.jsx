"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

export default function PaymentSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [enrollmentStatus, setEnrollmentStatus] = useState("processing"); // processing, success, error
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    // Process enrollment when component mounts
    processEnrollment();
  }, []);

  const processEnrollment = async () => {
    try {
      setEnrollmentStatus("processing");
      
      // 1. Fetch cart items
      const cartResponse = await api.get("/cart");
      const cartCourses = cartResponse.data?.courses || [];
      setTotalCourses(cartCourses.length);

      if (cartCourses.length === 0) {
        setEnrollmentStatus("success");
        startCountdown();
        return;
      }

      // 2. Enroll in each course
      let successCount = 0;
      for (const course of cartCourses) {
        try {
          await api.post(`/students/enroll/${course._id}`);
          successCount++;
          setEnrolledCount(successCount);
        } catch (error) {
          console.error(`Failed to enroll in course ${course._id}:`, error);
        }
      }

      // 3. Clear the cart
      try {
        // Delete each course from cart
        for (const course of cartCourses) {
          try {
            await api.delete(`/cart/${course._id}`);
          } catch (error) {
            console.error(`Failed to remove course ${course._id} from cart:`, error);
          }
        }
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }

      setEnrollmentStatus("success");
      startCountdown();
    } catch (error) {
      console.error("Enrollment process failed:", error);
      setEnrollmentStatus("error");
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/student/courses");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-rimary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-slideUp">
        {/* Success/Processing Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className={`absolute inset-0 ${enrollmentStatus === "processing" ? "bg-blue-400" : "bg-primary"} rounded-full blur-xl opacity-50 animate-pulse`}></div>
            <div className={`relative ${enrollmentStatus === "processing" ? "bg-blue-500" : "bg-green-500"} rounded-full p-6`}>
              {enrollmentStatus === "processing" ? (
                <Loader2 className="w-16 h-16 text-white animate-spin" strokeWidth={2.5} />
              ) : (
                <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {enrollmentStatus === "processing" ? "Processing Enrollment..." : "Payment Successful! 🎉"}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {enrollmentStatus === "processing" 
            ? `Enrolling you in ${totalCourses} course${totalCourses !== 1 ? 's' : ''}...` 
            : "Thank you for your purchase. Your courses are now available in your library."}
        </p>

        {/* Enrollment Progress */}
        {enrollmentStatus === "processing" && totalCourses > 0 && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">
              Enrolled in {enrolledCount} of {totalCourses} courses
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${(enrolledCount / totalCourses) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Countdown */}
        {enrollmentStatus === "success" && (
          <div className="mb-8 p-4 bg-primary rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-1">
              Redirecting to your courses in
            </p>
            <p className="text-4xl font-bold text-white">{countdown}</p>
            <p className="text-xs text-white mt-1">seconds</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/student/courses">
            <button 
              disabled={enrollmentStatus === "processing"}
              className={`cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-3.5 ${
                enrollmentStatus === "processing" 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/30"
              } text-white text-base font-bold rounded-lg transition-all duration-300`}
            >
              <ShoppingBag className="w-5 h-5" />
              View My Courses
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>

          <Link href="/student/explore">
            <button 
              disabled={enrollmentStatus === "processing"}
              className={`cursor-pointer w-full px-6 py-3 ${
                enrollmentStatus === "processing"
                  ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 text-primary border-primary"
              } text-base font-semibold border-2 rounded-lg transition-all duration-200`}
            >
              Continue Shopping
            </button>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your inbox
          </p>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
