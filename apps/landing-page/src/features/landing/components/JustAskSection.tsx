import React, { useMemo } from 'react';
import LightningBoltIcon from '@/icons/LightningBoltIcon';
import PencilIcon from '@/icons/PencilIcon';
import UserMessage from '@/features/chat/components/UserMessage';
import AssistantMessage from '@/features/chat/components/AssistantMessage';
import type { Document } from '@/features/document/document.service';
import { motion } from 'motion/react';

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
  const mockDocument = useMemo<Document>(() => ({
    id: 'doc1',
    file_url: '/landing-page/sample-document.pdf',
    file_name: 'Exam 2 Sample Questions',
    file_type: 'application/pdf',
    course_id: 'mock-course-1',
    created_at: '2024-01-01T00:00:00.000Z',
    report_count: 0
  }), []);

  const mockDocument2 = useMemo<Document>(() => ({
    id: 'doc2',
    file_url: '/landing-page/sample-document-2.pdf',
    file_name: 'Zinc and Iodine Lab Instructions',
    file_type: 'application/pdf',
    course_id: 'mock-course-1',
    created_at: '2024-01-01T00:00:00.000Z',
    report_count: 0
  }), []);
  const line = "just ask studyspot";
  return (
    <section id="just-ask" className="py-20">
      <div className="flex flex-row justify-center gap-8 items-stretch">
        <div className="flex-1 bg-[rgba(0,0,0,0.07)] rounded-2xl">
          {/* Left div content can go here if needed */}
        </div>
        <div className="w-full max-w-2xl shrink-0">
          <div className="text-center">
            <p className="text-xl text-[var(--primary-text-light)] -mb-1 mt-4">there&apos;s a better way</p>
            <motion.h2
              className="text-4xl md:text-6xl font-bold text-[var(--primary-text)] leading-tight font-[family-name:var(--font-gabarito)] mb-4 flex items-center justify-center relative left-3"
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
            <div className="relative inline-block">
              <p className="relative z-10 text-xl text-[var(--primary-text)]">
                StudySpot is the only AI with <br />
                <span className="italic font-bold">instant access to course knowledge</span>
              </p>
              <LightningBoltIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-2 w-24 h-24 text-[var(--yellow)] z-0" />
            </div>
          </div>
          <div className="mt-12 space-y-4">
            <UserMessage content="do you have the study guide for the next exam?" />
            <AssistantMessage
              content="Yes, I found the sample questions document for Exam 2, covering modules 4b-7a. This guide contains various question types and is designed to help you prepare for the 75-minute exam on October 30th."
              documents={[mockDocument]}
            />

            <div className="h-2 my-10 bg-[var(--primary-100)] rounded-2xl w-50 mx-auto">
            </div>

            <UserMessage content="how do i do the new lab?" />
            <AssistantMessage
              content="**Zinc and Iodine Lab: At a Glance:**<br>Always put safety first: goggles and gloves are a must, and work where there's good air circulation. For materials, you'll need zinc, iodine, water, and standard lab gear. The process involves mixing zinc and iodine, adding water, then filtering and evaporating the solution to get your zinc iodide.<br/><br/>Were you looking to dive deeper into any part of it?"
              documents={[mockDocument2]}
            />
          </div>
        </div>
        <div className="flex-1 bg-[rgba(0,0,0,0.07)] rounded-2xl">
          {/* Right div content can go here if needed */}
        </div>
      </div>
    </section>
  );
};

export default JustAskSection; 