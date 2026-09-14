'use client';
import { InfiniteSlider } from './motion-primitives/infinite-slider';

export function Footer() {
  return (
    <footer>
      <div className='mx-auto flex max-w-7xl flex-col items-center px-6 py-12'>
        <p className='text-sm text-zinc-500'>
          © {new Date().getFullYear()} Glasgow University AI Society. All rights
          reserved.
        </p>
        {/* Icons removed as they are not available in the project 
        <div className='order-first mb-4 flex items-center gap-x-6 md:order-none md:mb-0'>
          <a
            href='#'
            className='fill-zinc-500 hover:fill-zinc-900 dark:fill-zinc-400 dark:hover:fill-zinc-100'
          >
            <GitHubIcon className='h-4 w-4' />
          </a>
          <a
            href='#'
            className='fill-zinc-500 hover:fill-zinc-900 dark:fill-zinc-400 dark:hover:fill-zinc-100'
          >
            <XIcon className='h-4 w-4' />
          </a>
        </div> 
        */}
      </div>
      <div className='overflow-hidden [mask-image:linear-gradient(to_bottom,white_20%,transparent)]'>
        <InfiniteSlider
          className='-mb-14 whitespace-nowrap text-9xl leading-[100%] text-transparent [text-shadow:1px_1px_1px_rgba(255,255,255,.1),-1px_-1px_1px_rgba(0,0,0,.5),-40px_-40px_0px_rgba(0,0,0,0)] sm:text-[12rem]'
          gap={80}
          speed={60}
        >
          <div>Artificial Intelligence</div>
        </InfiniteSlider>
      </div>
    </footer>
  );
}
