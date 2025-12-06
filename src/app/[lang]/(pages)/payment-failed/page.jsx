"use client";
import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailed() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-slideUp">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-red-500 rounded-full p-6">
              <XCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Payment Failed
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We couldn't process your payment. Please try again or contact support if the problem persists.
        </p>

        {/* Common Reasons */}
        <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200 text-left">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Common reasons:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
            <li>Insufficient funds</li>
            <li>Incorrect card details</li>
            <li>Card expired or blocked</li>
            <li>Network connection issue</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white text-base font-bold rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <Link href="/cart">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-red-600 text-base font-semibold border-2 border-red-600 rounded-lg transition-all duration-200">
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </button>
          </Link>

          <Link href="/student/explore">
            <button className="w-full px-6 py-3 bg-white hover:bg-gray-50 text-gray-600 text-base font-medium border border-gray-300 rounded-lg transition-all duration-200">
              Continue Shopping
            </button>
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            Need help? Contact our support team
          </p>
          <a
            href="mailto:support@codexa.com"
            className="text-sm text-red-600 hover:text-red-700 font-semibold"
          >
            support@codexa.com
          </a>
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
