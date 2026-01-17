import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Send, ArrowUp, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  const { settings, loading } = usePlatformSettings();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return Facebook;
      case 'twitter':
        return Twitter;
      case 'instagram':
        return Instagram;
      case 'linkedin':
        return Linkedin;
      case 'youtube':
        return Youtube;
      case 'telegram':
      case 'tiktok':
      default:
        return Send;
    }
  };

  // Get non-empty social links
  const socialLinks = Object.entries(settings.social_links)
    .filter(([, url]) => url && url.trim() !== '')
    .map(([platform, url]) => ({ platform, url }));

  // Strategic footer link organization following best practices
  const platformLinks = [
    { label: 'Jobs', href: '/jobs' },
    { label: 'Companies', href: '/companies' },
    { label: 'AI Agents', href: '/ai-agents' },
    { label: 'Discussions', href: '/discussions' },
    { label: 'Rewards Program', href: '/rewards' },
    { label: 'Hire My Skill', href: '/hire-my-skill' },
  ];

  const resourceLinks = [
    { label: 'Interview Prep', href: '/interview-prep' },
    { label: 'Courses & Training', href: '/courses' },
    { label: 'Document Generator', href: '/document-generator' },
    { label: 'Salary Analyzer', href: '/salary-analyzer' },
    { label: 'Networking', href: '/networking' },
    { label: 'FAQ', href: '/faq' },
  ];

  const companyLinks = [
    { label: 'Affiliate Program', href: '/affiliate' },
    { label: 'Featured Services', href: '/featured-clients' },
    { label: 'Post a Job (Free)', href: '/post-job' },
    { label: 'Employer Dashboard', href: '/employer/dashboard' },
    { label: 'Pricing & Boost', href: '/employer/dashboard#pricing' },
    { label: 'Join Our Team', href: '/careers' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Security', href: '/security' },
  ];

  return (
    <footer className="bg-muted/50 border-t border-border py-12 mt-16 relative">
      {/* Scroll to top button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-20 right-4 z-50 rounded-full w-12 h-12 p-0 shadow-lg md:bottom-4 bg-primary hover:bg-primary/90"
        size="icon"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-bold text-xl text-primary mb-4">
              {settings.site_info.name || 'SupplyChain_KE'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {settings.site_info.tagline || 'Connecting supply chain professionals in Kenya with opportunities, insights, and community.'}
            </p>
            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {!loading && socialLinks.length > 0 ? (
                socialLinks.map(({ platform, url }) => {
                  const Icon = getSocialIcon(platform);
                  return (
                    <a 
                      key={platform}
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={platform}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground">Social links coming soon</p>
              )}
            </div>
            {/* Contact Info */}
            {settings.contact_info.email && (
              <p className="text-sm text-muted-foreground mt-4">
                <a href={`mailto:${settings.contact_info.email}`} className="hover:text-primary">
                  {settings.contact_info.email}
                </a>
              </p>
            )}
          </div>
          
          {/* Platform Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} {settings.site_info.name || 'SupplyChain_KE'}. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for the supply chain community in Kenya
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
