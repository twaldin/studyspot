// This component displays a popup warning users that the application is not optimized for mobile devices.
'use client';

import React, { useState, useEffect } from 'react';

const MobileWarningPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isCurrentlyMobile = window.innerWidth < 768; // Typical breakpoint for mobile
      setIsMobile(isCurrentlyMobile);
      // Show popup only if on mobile and not previously dismissed from session storage
      if (isCurrentlyMobile && sessionStorage.getItem('mobileWarningDismissed') !== 'true') {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('mobileWarningDismissed', 'true'); // Remember dismissal for this session
  };

  if (!isVisible || !isMobile) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full relative">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Mobile Notice</h3>
        <p className="mb-4 text-sm text-gray-600">
          StudySpot is not currently optimized for mobile devices. For the best experience, please use a desktop browser.
        </p>
        {/* <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Dismiss"
        >
          &times;
        </button> */}
        <button
          onClick={handleDismiss}
          className="btn-base rounded-lg bg-[var(--primary-100)] text-[var(--primary-100-text)] border-[var(--primary-100-outline)] shadow-[0_2px_0_0_var(--primary-100-outline),0_4px_4px_0_rgba(0,0,0,0.075)] active:shadow-[0_0px_0_0_var(--primary-100-outline),0_4px_4px_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_var(--primary-100-outline),0_6px_4px_0_rgba(0,0,0,0.075)] mt-2"
        >
          Okay, I understand
        </button>
      </div>
    </div>
  );
};

export default MobileWarningPopup; 