import { footerLinks } from "@/Constants/Home-data";
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function HomeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold text-primary">Codexa</h3>
            <p className="text-muted-foreground max-w-sm">
              Empowering learners worldwide with quality education and a
              supportive community. Start your journey today.
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
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Codexa. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Made with Codexa Team</p>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;

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
