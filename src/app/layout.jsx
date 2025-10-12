import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Codexa",
  description:
    "Codexa — Learn coding the smart way. Interactive lessons, real projects, and hands-on challenges to boost your programming skills.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-inter`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
