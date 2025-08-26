import { motion } from 'motion/react';
import Image from 'next/image';
import FlatPencil from '@/icons/FlatPencil';

const teamMembers = [
	{
		name: 'Tim Waldin',
		role: 'Founder',
		school: 'Purdue',
		image: '/landing-page/headshots/tim.jpg',
	},
	{
		name: 'David Vayntrub',
		role: 'Founding Engineer',
		school: 'UC Riverside',
		image: '/landing-page/headshots/david.jpeg',
	},
];

const TeamSection = () => {
	const line1 = "built for students";
	const line2 = "by students.";

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
		<section id="team" className="text-center pt-20 pb-16 md:pt-36 md:pb-32 px-4">
			<div className="container mx-auto">
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
						className="text-3xl sm:text-4xl md:text-7xl font-bold text-[var(--primary-text)] mb-6 leading-tight tracking-tight font-[family-name:var(--font-gabarito)]"
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
						className="text-base md:text-xl text-[var(--primary-text-light)] mb-12 md:mb-20 max-w-md mx-auto"
					>
						we&apos;re a team of like-minded students with a shared need for better AI study tools
					</motion.p>

					<div className="flex justify-center">
						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-2xl"
							variants={{
								visible: {
									transition: {
										staggerChildren: 0.2,
									},
								},
							}}
						>
							{teamMembers.map((member) => (
								<motion.div key={member.name} variants={fadeInUp} className="flex flex-col items-center w-48 mx-auto">
									{member.image ? (
										<Image
											src={member.image}
											alt={member.name}
											width={192}
											height={192}
											className="w-full h-48 object-cover rounded-xl mb-5"
										/>
									) : (
										<div className="w-full h-48 bg-[var(--primary-100)] rounded-xl mb-5"></div>
									)}
									<h3 className="text-xl text-[var(--primary-text)] mb-1">{member.name}</h3>
									<p className="text-[var(--primary-text-light)]">{member.role}</p>
									<p className="text-sm text-[var(--primary-text-light)]">{member.school}</p>
								</motion.div>
							))}
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default TeamSection;
