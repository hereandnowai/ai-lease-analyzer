import React from 'react';
import { BRANDING_INFO } from '../constants';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header style={{ backgroundColor: BRANDING_INFO.colors.secondary }} className="p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <button 
          onClick={onLogoClick} 
          className="flex items-center focus:outline-none focus:ring-2 rounded-md"
          style={{
            // @ts-ignore
            '--tw-ring-offset-color': BRANDING_INFO.colors.secondary,
            '--tw-ring-color': BRANDING_INFO.colors.primary,
          }}
          aria-label="Go to homepage"
        >
          <img src={BRANDING_INFO.logo.favicon} alt={`${BRANDING_INFO.organizationShortName} Favicon`} className="h-10 w-10 mr-3" />
          <img src={BRANDING_INFO.logo.title} alt={`${BRANDING_INFO.organizationShortName} Logo`} className="h-10 hidden sm:block" />
          <span className="text-xl font-bold ml-2 sm:ml-0" style={{ color: BRANDING_INFO.colors.primary }}>AI Lease Analyzer</span>
        </button>
        {/* <span style={{ color: BRANDING_INFO.colors.primary }} className="text-sm hidden md:block">{BRANDING_INFO.organizationLongName}</span> */}
      </div>
    </header>
  );
};

export default Header;
