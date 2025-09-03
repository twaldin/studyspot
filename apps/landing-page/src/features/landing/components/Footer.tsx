// This component renders the footer of the application.
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <Link href="https://instagram.com" className="text-[var(--primary-text-light)]">
            Instagram
          </Link>
          <Link href="https://youtu.be/qyRvIpFdQyk?si=5PM3lv81Fz32kQ4g" className="text-[var(--primary-text-light)]">
            YouTube
          </Link>
        </div>
        <div className="mt-2 h-2 rounded-full bg-[var(--primary-100)]"></div>
      </div>
    </footer>
  );
};

export default Footer;
