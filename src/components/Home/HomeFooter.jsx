"use client";

import { footerLinks } from "@/Constants/Home-data";
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

function HomeFooter() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const isRTL = i18n.dir() === "rtl";

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold text-primary">Codexa</h3>
            <p className="text-muted-foreground max-w-sm">
              {t("home.footer.description")}
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <SocialLink href="#" icon={Facebook} label="Facebook" />
              <SocialLink href="#" icon={Twitter} label="Twitter" />
              <SocialLink href="#" icon={Linkedin} label="LinkedIn" />
              <SocialLink href="#" icon={Instagram} label="Instagram" />
              <SocialLink href="#" icon={Github} label="GitHub" />
            </div>
          </div>

          {/* Platform Links */}
          <FooterSection title={t("home.footer.platform")} links={footerLinks.platform} />

          {/* Resources Links */}
          <FooterSection title={t("home.footer.resources")} links={footerLinks.resources} />

          {/* Legal Links */}
          <FooterSection title={t("home.footer.legal")} links={footerLinks.legal} />
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${isRTL ? "text-right" : "text-left"}`}>
          <p className="text-sm text-muted-foreground" dir="auto">
            <span className="ltr:ml-1">© {currentYear} Codexa.</span> {t("home.footer.allRights")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("home.footer.madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;

function FooterSection({ title, links }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-foreground">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t(`home.footer.${link.translationKey}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="bg-muted hover:bg-primary hover:text-primary-foreground p-2 rounded-full transition-colors"
    >
      <Icon size={18} />
    </a>
  );
}
