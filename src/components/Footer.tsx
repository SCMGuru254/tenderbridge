
import { NavLink } from "react-router-dom";
import { Truck, Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Discussions", href: "/discussions" },
        { label: "Interview Prep", href: "/interview-prep" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Find Jobs", href: "/jobs" },
        { label: "Post Jobs", href: "/post-job" },
        { label: "Companies", href: "/companies" },
        { label: "Messaging", href: "/messages" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Newsletter */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">SupplyChain_KE</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-sm">
              Your complete platform for supply chain professionals in Kenya. Find jobs, connect with
              peers, and stay updated with industry trends.
            </p>
            <div className="space-y-4">
              <h4 className="font-medium">Subscribe to our newsletter</h4>
              <div className="flex gap-2">
                <Input placeholder="Your email" type="email" className="max-w-xs" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="font-medium text-gray-900 mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      to={link.href}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links and Copyright */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm order-2 md:order-1 mt-4 md:mt-0">
              &copy; {currentYear} SupplyChain_KE. All rights reserved.
            </p>
            <div className="flex space-x-4 order-1 md:order-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
