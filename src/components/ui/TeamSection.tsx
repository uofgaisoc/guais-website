'use client';

import {
  Card,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import { TextEffect } from '@/components/motion-primitives/text-effect';
import { Spotlight } from '@/components/motion-primitives/spotlight';
import { Tilt } from '@/components/motion-primitives/tilt';
import { motion } from 'motion/react';
import Image from 'next/image';
import type { TeamMember } from '@/sanity/lib/queries';

interface TeamMemberProps {
  name?: string;
  role?: string;
  isComingSoon?: boolean;
  image?: string;
}

function TeamMemberCard({ name, role, isComingSoon, image }: TeamMemberProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
    >
      <Tilt
        rotationFactor={10}
        springOptions={{
          stiffness: 200,
          damping: 15,
          mass: 0.8,
          restSpeed: 0.001
        }}
      >
  <Card className="relative overflow-hidden group h-full bg-transparent border-none shadow-none w-auto">
  <Spotlight className="opacity-0 group-hover:opacity-100" />
  <CardContent className="flex flex-col items-center justify-between p-1 sm:p-2 min-h-[12rem] sm:min-h-[14rem]">
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-muted">
            {image ? (
              <Image
                src={image}
                alt={`${name}'s photo`}
                fill={true}
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                {isComingSoon ? '?' : 'Photo'}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <CardTitle className="text-lg sm:text-xl font-semibold text-center break-words">
              {isComingSoon ? 'Coming Soon' : name}
            </CardTitle>
            <p className="text-center text-primary font-medium text-sm sm:text-base break-words">
              {role}
            </p>
          </div>
        </div>
      </CardContent>
        </Card>
      </Tilt>
    </motion.div>
  );
}

// Shown when nobody has added team members in the Studio yet
const PLACEHOLDER_COUNT = 5;

export function TeamSection({ members }: { members: TeamMember[] }) {
  const cards: TeamMemberProps[] = members.length
    ? members.map((m) => ({ name: m.name, role: m.role, image: m.photoUrl }))
    : Array.from({ length: PLACEHOLDER_COUNT }, () => ({ isComingSoon: true, role: 'Position TBC' }));

  return (
    <section id="team" className="py-8 sm:py-12 flex flex-col items-center">
      <TextEffect
        as="h2"
        preset="fade-in-blur"
        className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12"
      >
        Meet the Team
      </TextEffect>

      <motion.div
        className="inline-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-center w-auto mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {cards.map((member, index) => (
          <div key={index} className={`${index === cards.length - 1 && cards.length % 2 !== 0 ? 'col-span-2 flex justify-center md:col-span-1' : ''}`}>
            <TeamMemberCard {...member} />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
