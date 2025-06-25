
import React from 'react';
import { SocialMediaLink as SocialMediaLinkType } from '../types';
import { BRANDING_INFO } from '../constants';

interface SocialIconLinkProps {
  platform: SocialMediaLinkType;
}

const SocialIconLink: React.FC<SocialIconLinkProps> = ({ platform }) => {
  const IconComponent = platform.icon;
  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform.name}
      className="hover:opacity-75 transition-opacity"
      style={{ color: BRANDING_INFO.colors.primary }}
    >
      <IconComponent className="w-6 h-6" />
    </a>
  );
};

export default SocialIconLink;
