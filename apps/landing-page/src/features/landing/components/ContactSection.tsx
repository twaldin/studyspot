import { motion } from 'motion/react';
import FlatPencil from '@/icons/FlatPencil';

const ContactSection = () => {
  const line1 = "we'd love to hear";
  const line2 = "from you";

  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.05,
        staggerChildren: 0.04,
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
        stiffness: 150,
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
        damping: 15,
        stiffness: 120,
      },
    },
  };

  return (
    <section id="contact" className="text-center pt-32 pb-20 md:pt-36 md:pb-32 min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.div variants={fadeInUp} className="flex justify-center -mb-2">
            <FlatPencil className="w-18 h-18 text-black" />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-[var(--primary-text)] mb-6 leading-[1.1] tracking-tight font-[family-name:var(--font-gabarito)]"
            variants={sentence}
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
            {line2.split(" ").map((word, index, arr) => (
              <motion.span
                key={word + "-" + index}
                variants={letter}
                className={`inline-block ${index < arr.length - 1 ? 'mr-[0.25em]' : ''}`}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-[var(--primary-text-light)] max-w-md mx-auto"
          >
            <a href="mailto:timothy@waldin.net" className="hover:text-[var(--primary-text)] transition-colors">
              timothy@waldin.net
            </a>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
