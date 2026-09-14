'use client';

import Image from 'next/image';
import { TextEffect } from '@/components/motion-primitives/text-effect';
import { motion } from 'motion/react';

const ENTRY_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  },
};

export function HeroAnimatedContent({ membershipLink }: { membershipLink: string }) {
  return (
    <>
      <div className="flex flex-row items-center justify-center gap-4 md:gap-6">
        <div className="flex flex-col">
          <TextEffect
            as="h1"
            preset="fade-in-blur"
            per="char"
            speedReveal={4}
            segmentTransition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-4xl font-light tracking-tight sm:text-5xl md:text-6xl"
          >
            Glasgow University
          </TextEffect>
          <TextEffect
            as="h2"
            preset="fade-in-blur"
            per="char"
            speedReveal={4}
            delay={0.2} // Delay for staggering after the first title
            segmentTransition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          >
            AI Society
          </TextEffect>
        </div>
        <motion.div
          variants={ENTRY_VARIANTS}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.5,
            delay: 0.4, // Delay for the logo animation
            ease: 'easeOut',
          }}
        >
          <Image
            src="/circle_logo.png"
            alt="AI Society Logo"
            width={96}
            height={96}
            className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-contain"
          />
        </motion.div>
      </div>
      <TextEffect
        as="p"
        preset="blur"
        per="line"
        delay={0.6} // Delay for the paragraph animation
        speedReveal={0.8}
        segmentTransition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-lg sm:text-xl text-center max-w-2xl"
      >
        Welcome to the Glasgow University AI Society, where we explore the fascinating world of artificial intelligence through events, workshops, and community engagement.
      </TextEffect>
      <motion.div
        initial={{ opacity: 0, filter: 'blur(12px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
        className="mt-4 flex justify-center"
      >
        <a
          href={membershipLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm sm:text-base font-medium hover:opacity-90"
        >
          Become a member for free!
        </a>
      </motion.div>
    </>
  );
}
