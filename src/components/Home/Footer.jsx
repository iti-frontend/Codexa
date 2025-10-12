import { Facebook, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-primary/10 py-14">
      <div className="container mx-auto p-6 w-[90%]  lg:w-full">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold text-primary">Codexa</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Empowering developers worldwide with quality education and
              community support.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#courses"
                  className="transition-colors hover:text-primary"
                >
                  Courses
                </a>
              </li>
              <li>
                <a
                  href="#community"
                  className="transition-colors hover:text-primary"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  className="transition-colors hover:text-primary"
                >
                  Reviews
                </a>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Certifications
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#about"
                  className="transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-300 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Codexa. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <Link
              href="mailto:hello@codexa.com"
              className="hover:text-foreground"
            >
              hello@codexa.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
