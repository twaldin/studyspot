import React from 'react';
import LightningBoltIcon from '@/icons/LightningBoltIcon';
import PencilIcon from '@/icons/PencilIcon';
import { motion } from 'motion/react';
import Image from 'next/image';

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.25,
      staggerChildren: 0.12,
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
      damping: 15,
      stiffness: 80,
    },
  },
};

const JustAskSection = () => {
  const line = "just ask studyspot";
  
  return (
    <section id="just-ask" className="py-12 md:py-20 px-4">
      <div className="flex flex-col lg:flex-row justify-center gap-4 lg:gap-8 items-stretch max-w-7xl mx-auto">
        <div className="hidden lg:block flex-1 bg-[rgba(0,0,0,0.07)] rounded-2xl">
          {/* Left div content can go here if needed */}
        </div>
        <div className="w-full max-w-2xl mx-auto lg:shrink-0">
          <div className="text-center">
            <p className="text-xl text-[var(--primary-text-light)] -mb-1 mt-4">there&apos;s a better way</p>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-[var(--primary-text)] leading-tight font-[family-name:var(--font-gabarito)] mb-4 flex flex-wrap items-center justify-center"
              variants={sentence}
            >
              {line.split(" ").map((word, index, arr) => (
                <motion.span
                  key={word + "-" + index}
                  variants={letter}
                  className={`inline-block ${index < arr.length - 1 ? 'mr-[0.25em]' : ''}`}
                >
                  {word}
                </motion.span>
              ))}
              <motion.span variants={letter} className="inline-block">
                <PencilIcon className="w-16 h-16 text-[var(--primary-text)] ml-0 relative top-2" />
              </motion.span>
            </motion.h2>
            <div className="relative inline-block mb-12">
              <p className="relative z-10 text-xl text-[var(--primary-text)]">
                StudySpot is the only AI with <br />
                <span className="italic font-bold">instant access to course knowledge</span>
              </p>
              <LightningBoltIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-2 w-24 h-24 text-[var(--yellow)] z-0" />
            </div>
          </div>
          
          {/* Replace chat components with chat image */}
          <div className="mt-8">
            <Image
              src="/chatimg.png"
              alt="StudySpot chat interface showing AI answering questions about exams and labs"
              width={800}
              height={600}
              className="w-full h-auto rounded-xl shadow-lg"
              priority
            />
          </div>
        </div>
        <div className="hidden lg:block flex-1 bg-[rgba(0,0,0,0.07)] rounded-2xl">
          {/* Right div content can go here if needed */}
        </div>
      </div>
    </section>
  );
};

export default JustAskSection;