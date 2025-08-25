"use client";

import Image from "next/image";
import TurnArrow from "@/icons/TurnArrow";
import { motion } from "motion/react";

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

const descriptionAndArrow = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4,
      type: "spring" as const,
      damping: 15,
      stiffness: 80,
    },
  },
};

const imageContainer = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.7,
      type: "spring" as const,
      damping: 15,
      stiffness: 80,
    },
  },
};

const CanvasSucksSection = () => {
  return (
    <motion.section
      id="canvas-sucks"
      className="py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-8">
          {/* Right Image Content */}
          <motion.div
            className="lg:w-1/2 w-full lg:order-last"
            variants={imageContainer}
          >
            <div className="w-full rounded-4xl p-4 pt-10 pl-10 bg-[rgba(0,0,0,0.07)] border-none">
              <div className="h-[28rem] overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.1)]">
                <Image
                  src="/landing-page/canvas-screenshot.jpeg" // Placeholder path
                  alt="Canvas LMS screenshot"
                  width={1000}
                  height={600}
                  className="max-w-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Left Text Content */}
          <div className="lg:w-2/5 text-center lg:text-right lg:order-first">
            <motion.h2
              className="text-5xl md:text-6xl font-bold text-[var(--primary-text)] mb-2 leading-tight font-[family-name:var(--font-gabarito)] inline-flex items-center"
              variants={sentence}
            >
              <motion.span variants={letter}>
                <Image
                  src="/landing-page/canvas-logo.png"
                  alt="Canvas logo"
                  width={48}
                  height={48}
                  className="mr-4 translate-y-1.5"
                />
              </motion.span>
              <motion.span variants={letter}>
                canvas
              </motion.span>
              <motion.span variants={letter}>
                <span className="text-black bg-[var(--yellow)] px-1 py-0 rounded-lg ml-2 leading-none inline-block">
                  sucks.
                </span>
              </motion.span>
            </motion.h2>
            <motion.div variants={descriptionAndArrow}>
              <p className="text-lg md:text-xl text-[var(--primary-text-light)]">
                inconsistent course pages
                <br />
                and clunky, outdated UI?
              </p>
              <div className="flex justify-center lg:justify-end mt-6">
                <TurnArrow width={60} height={60} className="text-[rgba(0,0,0,0.15)]" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CanvasSucksSection; 