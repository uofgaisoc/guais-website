import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { PortableText } from '@portabletext/react' // Import PortableText
import type { TypedObject } from '@portabletext/types' // Import TypedObject

import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from '@/components/motion-primitives/morphing-dialog' // Updated import path
import { Button } from '@/components/ui/button'
import { InView } from '@/components/ui/in-view' // Import the InView component
// import { PlusIcon } from 'lucide-react' // Removed as PlusIcon button is removed

// Define an interface for the Event data
interface PastEvent {
  _id: string;
  title?: string;
  slug?: { current?: string };
  homepageBanner?: SanityImageSource;
  eventPageImages?: SanityImageSource[];
  homepageShortDescription?: TypedObject[]; // Now Portable Text
  eventDate?: string;
}

// Function to fetch past events
async function getPastEvents(): Promise<PastEvent[]> {
  const query = groq`*[_type == "event" && status == "past"] | order(eventDate desc){
    _id,
    title,
    slug,
    homepageBanner,
    eventPageImages, // Fetching in case homepageBanner is not set for past events
    homepageShortDescription,
    eventDate
  }`
  try {
    // Add the next-sanity config object with the tag here
    const events = await client.fetch<PastEvent[]>(query, {}, { next: { tags: ['event'] } })
    return events || []
  } catch (error) {
    console.error("Failed to fetch past events:", error)
    return []
  }
}

export default async function EventsPage() {
  const pastEvents = await getPastEvents()

  const cardVariants = {
    hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  }

  const cardTransition = {
    duration: 0.3,
    ease: 'easeInOut' as const,
  }

  const cardViewOptions = {
    once: true,
    amount: 0.1, // Trigger animation when a smaller part of the card is visible
    rootMargin: '0px 0px -50px 0px', // Changed margin to rootMargin
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center">Past Events</h1>
      
      {pastEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pastEvents.map((event) => {
            // Determine which image to use: homepageBanner or first of eventPageImages
            const displayImage = event.homepageBanner || (event.eventPageImages && event.eventPageImages[0]);

            return (
              <InView
                key={event._id} // Move key to the InView wrapper
                variants={cardVariants}
                transition={cardTransition}
                viewOptions={cardViewOptions}
                className="flex" // Ensure InView takes up space for grid layout
              >
                <MorphingDialog
                  // imageLayoutId prop removed as it's not used by the new component
                  transition={{
                  type: 'spring',
                  bounce: 0.05,
                  duration: 0.25,
                }}
              >
                <MorphingDialogTrigger
                  style={{ borderRadius: '12px' }}
                  className='flex w-full flex-col overflow-hidden border text-left shadow-md hover:shadow-xl transition-shadow bg-card text-card-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                >
                  {displayImage && (
                    <MorphingDialogImage
                      src={urlFor(displayImage).width(400).height(300).auto('format').url()}
                      alt={event.title || 'Event image'}
                      className='h-48 w-full object-cover' // Image for the trigger card
                    />
                  )}
                  <div className='flex grow flex-col justify-between p-4'>
                    {event.title && (
                      <MorphingDialogTitle className='text-lg font-semibold mb-1'>
                        {event.title}
                      </MorphingDialogTitle>
                    )}
                    {/* Optional: display date on card if desired - keeping it for now */}
                    {event.eventDate && (
                      <p className='text-xs text-muted-foreground mb-2'>
                        {new Date(event.eventDate).toLocaleDateString()}
                      </p>
                    )}
                    {/* PlusIcon button removed, whole card is trigger */}
                  </div>
                </MorphingDialogTrigger>

                <MorphingDialogContainer> {/* Handles the backdrop and centering */}
                  <MorphingDialogContent
                    style={{ borderRadius: '24px' }} // Style for the expanded content
                    className='w-full max-w-lg overflow-hidden border shadow-xl bg-card text-card-foreground' // Theme-aware classes
                  >
                    {displayImage && (
                       <div className="relative w-full aspect-[16/9] sm:aspect-video"> {/* Image in the expanded dialog */}
                        <MorphingDialogImage
                          src={urlFor(displayImage).width(800).height(450).auto('format').url()}
                          alt={event.title || 'Event image'}
                          className='h-full w-full object-cover'
                        />
                       </div>
                    )}
                    <div className='p-6'>
                      {event.title && (
                        <MorphingDialogTitle className='text-2xl font-bold mb-1'>
                          {event.title}
                        </MorphingDialogTitle>
                      )}
                       {event.eventDate && ( // Display date in expanded view
                        <MorphingDialogSubtitle className='text-sm text-muted-foreground mb-3'>
                          {new Date(event.eventDate).toLocaleDateString()}
                        </MorphingDialogSubtitle>
                      )}
                      {event.homepageShortDescription && (
                        <MorphingDialogDescription className="prose dark:prose-invert prose-sm max-w-none mt-2 text-muted-foreground whitespace-pre-line">
                          <PortableText value={event.homepageShortDescription} />
                        </MorphingDialogDescription>
                      )}
                      {event.slug?.current && (
                        <Button asChild className="mt-6">
                          <Link href={`/events/${event.slug.current}`}>
                            Read More
                          </Link>
                        </Button>
                      )}
                    </div>
                  <MorphingDialogClose className="text-muted-foreground hover:text-foreground" />
                  </MorphingDialogContent>
                </MorphingDialogContainer>
              </MorphingDialog>
              </InView>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No past events found.</p>
        </div>
      )}
    </main>
  )
}
