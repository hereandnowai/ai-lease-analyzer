
import React from 'react';
import { BRANDING_INFO, IconBlog, IconLinkedIn, IconInstagram, IconGitHub, IconX, IconYouTube } from '../constants';
import SocialIconLink from './SocialIconLink';
import { SocialMediaLink } from '../types';


const Footer: React.FC = () => {
  const socialLinks: SocialMediaLink[] = [
    { name: BRANDING_INFO.socialMedia.blog.name, url: BRANDING_INFO.socialMedia.blog.url, icon: IconBlog },
    { name: BRANDING_INFO.socialMedia.linkedin.name, url: BRANDING_INFO.socialMedia.linkedin.url, icon: IconLinkedIn },
    { name: BRANDING_INFO.socialMedia.instagram.name, url: BRANDING_INFO.socialMedia.instagram.url, icon: IconInstagram },
    { name: BRANDING_INFO.socialMedia.github.name, url: BRANDING_INFO.socialMedia.github.url, icon: IconGitHub },
    { name: BRANDING_INFO.socialMedia.x.name, url: BRANDING_INFO.socialMedia.x.url, icon: IconX },
    { name: BRANDING_INFO.socialMedia.youtube.name, url: BRANDING_INFO.socialMedia.youtube.url, icon: IconYouTube },
  ];

  return (
    <footer style={{ backgroundColor: BRANDING_INFO.colors.secondary }} className="p-6 text-center mt-auto">
      <div className="container mx-auto">
        <div className="flex justify-center space-x-6 mb-4">
          {socialLinks.map(link => (
            <SocialIconLink key={link.name} platform={link} />
          ))}
        </div>
        <p style={{ color: BRANDING_INFO.colors.primary }} className="text-sm">
          &copy; {new Date().getFullYear()} {BRANDING_INFO.organizationShortName}. All rights reserved. Developed by Bilmia M Binson.
        </p>
        <p style={{ color: BRANDING_INFO.colors.primary }} className="text-xs mt-1 italic">
          {BRANDING_INFO.slogan}
        </p>
         <p className="text-xs mt-2 whitespace-nowrap">
            <a href={BRANDING_INFO.website} target="_blank" rel="noopener noreferrer" style={{ color: BRANDING_INFO.colors.primary }} className="hover:underline">
                {BRANDING_INFO.website}
            </a>
            <span style={{ color: BRANDING_INFO.colors.primary }} className="mx-2">|</span>
            <a href={`mailto:${BRANDING_INFO.email}`} style={{ color: BRANDING_INFO.colors.primary }} className="hover:underline">
                {BRANDING_INFO.email}
            </a>
            <span style={{ color: BRANDING_INFO.colors.primary }} className="mx-2">|</span>
            <span style={{ color: BRANDING_INFO.colors.primary }}>{BRANDING_INFO.mobile}</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;