"use client";

import DownArrow from "@/icons/DownArrow";
import CtaButton from "@/features/landing/components/CtaButton";
import { motion } from 'motion/react';

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.25,
      staggerChildren: 0.10,
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 14,
      stiffness: 90,
    },
  },
};

const SignUpSection = () => {
    const words = ["sign", "up", "now", "for", "free", "early", "access", "🚀"];

    return (
        <section id="signup" className="text-center py-14 md:py-18">
            <div className="container mx-auto px-4">
                <motion.h2
                  className="text-4xl md:text-5xl font-bold text-[var(--primary-text)] mb-6 flex items-center justify-center tracking-tight font-[family-name:var(--font-gabarito)]"
                  variants={sentence}
                >
                    {words.map((word, index) => (
                      <motion.span
                        key={word + "-" + index}
                        variants={letter}
                        className={`inline-block ${index < words.length - 1 ? 'mr-[0.25em]' : ''}`}
                      >
                        {word === 'free' ? <u>{word}</u> : word}
                      </motion.span>
                    ))}
                </motion.h2>
                <DownArrow className="w-8 h-11 mx-auto my-8 text-[var(--primary-200)]" />
                <div className="flex justify-center items-center">
                    <CtaButton href="https://app.study-spot.com/">
                        Get Started
                    </CtaButton>
                </div>
            </div>
        </section>
    );
}

export default SignUpSection;
