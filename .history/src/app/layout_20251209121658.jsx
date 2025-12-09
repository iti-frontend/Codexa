import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["200","300","400","500","600","700","800","900"],
});

export const metadata = {
  title: "Codexa",
  description:
    "Codexa — Learn coding the smart way. Interactive lessons, real projects, and hands-on challenges to boost your programming skills.",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="ar">
      <body className={`${cairo.variable} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
