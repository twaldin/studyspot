"use client";

import { useState, type ReactNode, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from '@/features/landing/components/Navbar';
import HeroContent from '@/features/landing/components/HeroContent';
import HeroScreenshot from '@/features/landing/components/HeroScreenshot';
import CanvasSucksSection from '@/features/landing/components/CanvasSucksSection';
import JustAskSection from '@/features/landing/components/JustAskSection';
import TeamSection from '@/features/landing/components/TeamSection';
import ContactSection from '@/features/landing/components/ContactSection';
import ScrollingIconsSection from '@/features/landing/components/ScrollingIconsSection';
import SignUpSection from '@/features/landing/components/SignUpSection';
import Footer from '@/features/landing/components/Footer';

const AnimatedSection = ({ children, delay = 0 }: { children: ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1,
        delay,
        staggerChildren: 0.2
      }
    }}
    viewport={{ once: true, amount: 0.3 }}
  >
    {children}
  </motion.div>
);

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'team' | 'contact'>('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  const handleNavClick = (section: 'overview' | 'team' | 'contact') => {
    setActiveSection(section);
  };

  const renderOverview = () => (
    <>
      <AnimatedSection>
        <HeroContent />
      </AnimatedSection>
      <AnimatedSection delay={0.5}>
        <HeroScreenshot />
      </AnimatedSection>
      <AnimatedSection>
        <ScrollingIconsSection />
      </AnimatedSection>
      <AnimatedSection>
        <CanvasSucksSection />
      </AnimatedSection>
      <AnimatedSection>
        <ScrollingIconsSection direction="right" />
      </AnimatedSection>
      <AnimatedSection>
        <JustAskSection />
      </AnimatedSection>
      <AnimatedSection>
        <ScrollingIconsSection />
      </AnimatedSection>
      <AnimatedSection>
        <SignUpSection />
      </AnimatedSection>
    </>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'team':
        return <AnimatedSection><TeamSection /></AnimatedSection>;
      case 'contact':
        return <AnimatedSection><ContactSection /></AnimatedSection>;
      default:
        return renderOverview();
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar activeSection={activeSection} onNavClick={handleNavClick} />
      {renderSection()}
      <AnimatedSection>
        <Footer />
      </AnimatedSection>
    </main>
  );
}