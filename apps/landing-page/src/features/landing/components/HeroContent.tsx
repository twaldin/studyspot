// This component renders the main title and call to action for the hero section.
import { motion } from 'motion/react';
import CtaButton from "@/features/landing/components/CtaButton";

const HeroContent = () => {
  const line1 = "stop searching,";
  const line2 = "start learning";

  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        staggerChildren: 0.06,
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
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const badgeContainerVariants = {
    hidden: { maxWidth: 0, opacity: 0 },
    visible: {
      maxWidth: '500px',
      opacity: 1,
      transition: {
        delay: 0.8,
        type: 'spring' as const,
        damping: 15,
        stiffness: 80,
      },
    },
  };

  const badgeText = "🎉 Coming to Purdue Fall 2025!";

  const badgeTextContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.9,
        staggerChildren: 0.05,
      },
    },
  };

  const badgeWord = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section id="overview" className="text-center pt-24 md:pt-36 px-4">
      <div className="container mx-auto">
        <div className="h-8 md:h-9 mb-3">
          <motion.div
            className="text-sm md:text-base text-[var(--primary-100-text)] border-2 rounded-full inline-block border-[var(--primary-100)] overflow-hidden"
            variants={badgeContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="px-4 py-1 whitespace-nowrap"
              variants={badgeTextContainer}
            >
              {badgeText.split(" ").map((word, index, arr) => (
                <motion.span
                  key={word + "-" + index}
                  variants={badgeWord}
                  className={`inline-block ${index < arr.length - 1 ? 'mr-[0.25em]' : ''}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-[var(--primary-text)] mb-6 leading-tight md:leading-20 tracking-tight font-[family-name:var(--font-gabarito)]"
          variants={sentence}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {line1.split(" ").map((word, index, arr) => (
            <motion.span
              key={word + "-" + index}
              variants={letter}
              className={`inline-block ${index < arr.length - 1 ? 'mr-[0.25em]' : ''}`}
            >
              {word}
            </motion.span>
          ))}
          <br />
          {line2.split(" ").map((word, index, arr) => {
            const isLearning = word === "learning";
            return (
              <motion.span
                key={word + "-" + index}
                variants={letter}
                className={`inline-block ${index < arr.length - 1 ? 'mr-[0.25em]' : ''}`}
              >
                {isLearning ? (
                  <span className="bg-[var(--yellow)] px-2 py-0 md:px-3 rounded-lg inline-block leading-none">
                    {word}
                  </span>
                ) : (
                  word
                )}
              </motion.span>
            );
          })}
        </motion.h1>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
              },
            },
          }}
        >
          <motion.p
            className="text-lg md:text-xl text-[var(--primary-text-light)] mb-10 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            the first study tool that actually
            <br />
            <span className="italic">knows</span> your course <span className="text-2xl">📚</span>
          </motion.p>
          <motion.div
            className="inline-flex items-center gap-4"
            variants={fadeInUp}
          >
            <p className="text-md text-[var(--primary-text-light)]">For free early access,</p>
            <CtaButton href="https://app.study-spot.com">
              Get Started
            </CtaButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroContent;
