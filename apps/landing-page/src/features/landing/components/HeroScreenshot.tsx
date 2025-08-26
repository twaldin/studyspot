// This component renders the screenshot of the product for the hero section.
import Image from "next/image";
import { motion } from "motion/react";

const HeroScreenshot = () => {
    const screenshotVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.5,
                type: 'spring' as const,
                damping: 15,
                stiffness: 100,
            }
        }
    };

    return (
        <motion.section 
            className="pb-20 md:pb-16"
            variants={screenshotVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="container mx-auto px-4 mt-12">
                <div className="mx-auto w-fit rounded-4xl border-2 border-[var(--primary-100)] p-4">
                    <Image
                        src="/heroimg.png"
                        alt="StudySpot application screenshot"
                        width={1100}
                        height={625}
                        className="rounded-2xl border border-[rgba(0,0,0,0.25)] shadow-[0px_0px_30px_15px_rgba(0,0,0,0.025)] mx-auto"
                        priority
                    />
                </div>
            </div>
        </motion.section>
    );
};

export default HeroScreenshot; 