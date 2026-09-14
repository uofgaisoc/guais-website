'use client';

import Link from 'next/link';
import { AnimatedBackground } from '@/components/motion-primitives/animated-background';

export function Navbar() {
  const TABS = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav 
      className='fixed left-1/2 top-0 z-50 mt-4 flex -translate-x-1/2 justify-center rounded-full bg-background/30 p-2 backdrop-blur-lg'
      // Applied glassmorphism: fixed positioning, centering, top margin, rounded-full for the nav itself,
      // semi-transparent background (bg-background/30), padding around AnimatedBackground, and backdrop-blur.
      // The py-4 from the previous sticky version is replaced by p-2.
      // mt-7 changed to mt-4 for a slightly higher position, adjust as needed.
    >
      <AnimatedBackground
        defaultValue={TABS[0].name}
        // className for AnimatedBackground provides its own rounded corners and more opaque background for the links.
        className='rounded-xl bg-zinc-100/70 dark:bg-zinc-800/70 shadow-md' 
        // Added shadow-md for a bit more depth and slightly more opacity to its own background.
        transition={{
          type: 'spring',
          bounce: 0.2,
          duration: 0.3,
        }}
        enableHover
      >
        {TABS.map((tab) => (
          <Link
            href={tab.href}
            key={tab.name}
            data-id={tab.name}
            className='px-6 py-3 text-sm font-medium text-zinc-700 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50'
            // Adjusted padding and text size slightly for the new container.
          >
            {tab.name}
          </Link>
        ))}
      </AnimatedBackground>
    </nav>
  );
}
