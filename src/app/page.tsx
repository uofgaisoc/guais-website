// import Image from 'next/image' // No longer directly used here
// import Link from 'next/link' // No longer directly used here
import { client } from '@/sanity/lib/client' // Adjusted path
// import { urlFor } from '@/sanity/lib/image' // No longer directly used here
import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types' // Re-import for Event interface
// import { PortableText } from '@portabletext/react' // No longer directly used here
import type { TypedObject } from '@portabletext/types' // Re-import for Event interface

// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card' // Card components used in HomepageEventCard
// import { Button } from '@/components/ui/button' // Button used in HomepageEventCard

import { HomepageEventCard } from '@/components/ui/HomepageEventCard' // Import the new client component
import { HeroAnimatedContent } from '@/components/HeroAnimatedContent' // Import the new animated content component
import { WhoWeAreSection } from '@/components/ui/WhoWeAreSection' // Import the Who We Are section
import { JoinUsSection } from '@/components/ui/JoinUsSection' // Import the Join Us section
import { InView } from '@/components/ui/in-view' // Import the InView component
import { getSiteSettings } from '@/sanity/lib/queries'

// Event interface might be shared or defined in HomepageEventCard.
// For now, assuming HomepageEventCard defines its own or imports a shared one.
// If not, we might need to export/import it or move to a shared types file.
interface Event { // Use specific types for data fetched in server component
  _id: string;
  title?: string;
  homepageBanner?: SanityImageSource;
  homepageShortDescription?: TypedObject[];
  ticketLink?: string;
  slug?: { current?: string };
}


// Function to fetch the upcoming event
async function getUpcomingEvent(): Promise<Event | null> {
  const query = groq`*[_type == "event" && (status == "upcoming" || isFeatured == true)] | order(isFeatured desc, eventDate asc)[0]{
    _id,
    title,
    homepageBanner,
    homepageShortDescription,
    ticketLink,
    slug
  }`
  try {
    // Add the next-sanity config object with the tag here
    const event = await client.fetch<Event>(query, {}, { next: { tags: ['event'] } })
    return event || null
  } catch (error) {
    console.error("Failed to fetch upcoming event:", error)
    return null
  }
}

export default async function Home() {
  const [event, settings] = await Promise.all([getUpcomingEvent(), getSiteSettings()])

  const sectionVariants = {
    hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  }

  const sectionTransition = {
    duration: 0.3,
    ease: 'easeInOut' as const, // Added 'as const' for stricter typing if needed, or verify 'motion/react' Easing type
  }

  const sectionViewOptions = {
    once: true,
    amount: 0.2,
    rootMargin: '0px 0px -200px 0px', // Changed margin to rootMargin
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 bg-background text-foreground">
      <main className="container mx-auto flex flex-col items-center gap-12 pb-10 pt-6 sm:pt-8"> {/* Increased gap for sections */}
        <HeroAnimatedContent membershipLink={settings.membershipLink} />

        {/* Upcoming Event Section */}
        <InView
          as="section"
          variants={sectionVariants}
          transition={sectionTransition}
          viewOptions={sectionViewOptions}
          className="w-full flex flex-col items-center gap-6"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            Upcoming Events
          </h2>
          <HomepageEventCard event={event} />
        </InView>

        {/* Who We Are Section */}
        <InView
          as="section"
          variants={sectionVariants}
          transition={sectionTransition}
          viewOptions={sectionViewOptions}
          className="w-full flex flex-col items-center"
        >
          <WhoWeAreSection />
        </InView>

        {/* Join Us Section */}
        <InView
          as="section"
          variants={sectionVariants}
          transition={sectionTransition}
          viewOptions={sectionViewOptions}
          className="w-full flex flex-col items-center"
        >
          <JoinUsSection socials={settings.socials} />
        </InView>
      </main>
    </div>
  )
}
