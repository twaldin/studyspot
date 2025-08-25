// This component renders the navigation bar for the application, including a logo, navigation links, and a mobile menu toggle.
"use client";

import { Button } from '@headlessui/react';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import StudySpotLogo from '@/icons/StudySpotLogo';

interface NavbarProps {
  activeSection: 'overview' | 'team' | 'contact';
  onNavClick: (section: 'overview' | 'team' | 'contact') => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getButtonClasses = (sectionName: 'overview' | 'team' | 'contact') => {
    const baseClasses = "px-6 py-3 text-sm";
    if (sectionName === activeSection) {
      return `${baseClasses} panel-primary-200 text-[var(--primary-200-text)] border-[rgba(0,0,0,0.07)] cursor-pointer`;
    }
    return `${baseClasses} panel-primary-200 bg-transparent border-none text-[var(--primary-100-text)] shadow-none cursor-pointer`;
  };

  const getMobileButtonClasses = (sectionName: 'overview' | 'team' | 'contact') => {
    const baseClasses = "block w-full text-left px-6 py-3 text-sm";
    if (sectionName === activeSection) {
      return `${baseClasses} panel-primary-200 text-[var(--primary-200-text)] border-[rgba(0,0,0,0.07)]`;
    }
    return `${baseClasses} panel-primary-200 bg-transparent border-none text-[var(--primary-100-text)] shadow-none`;
  };

  const handleNav = (section: 'overview' | 'team' | 'contact') => {
    onNavClick(section);
    setMobileMenuOpen(false); // Close mobile menu on selection
  };

  return (
    <nav className="bg-transparent py-6 px-4 md:px-8 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <StudySpotLogo className="h-14 text-[var(--primary-text)]" />
        <div className="hidden md:flex panel-primary-100 border-[rgba(0,0,0,0.07)] rounded-3xl p-2">
          <Button 
            className={getButtonClasses('overview')}
            onClick={() => handleNav('overview')}
          >
            Overview
          </Button>
          <Button 
            className={getButtonClasses('team')}
            onClick={() => handleNav('team')}
          >
            Team
          </Button>
          <Button 
            className={getButtonClasses('contact')}
            onClick={() => handleNav('contact')}
          >
            Contact
          </Button>
        </div>
        <div className="md:hidden flex items-center">
          <Button
            className="p-2 rounded-md text-[var(--primary-text)] hover:text-[var(--primary-text-light)] hover:bg-[var(--primary-100)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--blue)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden panel-primary-100 border-[rgba(0,0,0,0.07)] rounded-3xl p-2 mt-2">
          <Button 
            className={getMobileButtonClasses('overview')}
            onClick={() => handleNav('overview')}
          >
            Overview
          </Button>
          <Button 
            className={getMobileButtonClasses('team') + ' mt-1'}
            onClick={() => handleNav('team')}
          >
            Team
          </Button>
          <Button 
            className={getMobileButtonClasses('contact') + ' mt-1'}
            onClick={() => handleNav('contact')}
          >
            Contact
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
