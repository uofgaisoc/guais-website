'use client'

import Image from 'next/image'
import Link from 'next/link' // Import Link for the button
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { TypedObject } from '@portabletext/types'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button' // Import buttonVariants for styling Link, removed Button
import { cn } from '@/lib/utils'

// Re-define or import Event interface (ensure it matches the one in page.tsx or a shared types file)
interface Event {
  _id: string;
  title?: string;
  homepageBanner?: SanityImageSource;
  homepageShortDescription?: TypedObject[];
  ticketLink?: string;
  slug?: { current?: string }; // Keep slug in case it's needed for other links later
}

interface HomepageEventCardProps {
  event: Event | null;
}

export function HomepageEventCard({ event }: HomepageEventCardProps) {
  if (!event) {
    return (
      <div className="text-center p-10 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">No Upcoming Events</h2>
        <p className="text-muted-foreground">
          Please check back later for new events!
        </p>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader className="text-center sm:text-left">
        {event.title && <CardTitle className="text-3xl sm:text-4xl">{event.title}</CardTitle>}
      </CardHeader>
      <CardContent className="space-y-6">
        {event.homepageBanner && (
          <div className="relative w-full overflow-hidden rounded-md" style={{ paddingBottom: '50%' }}> {/* 2:1 Aspect Ratio */}
            <Image
              src={urlFor(event.homepageBanner).width(1200).height(600).fit('crop').auto('format').url()}
              alt={event.title || 'Event banner'}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        {event.homepageShortDescription && (
          <div className="prose dark:prose-invert max-w-none text-lg text-muted-foreground whitespace-pre-line">
            {/* Ensure homepageShortDescription is an array, even if empty, for PortableText */}
            <PortableText value={event.homepageShortDescription.length > 0 ? event.homepageShortDescription : []} />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
        {event.ticketLink && (
          // Use Link styled as a button
          <Link
            href={event.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: 'lg' }), "w-full sm:w-auto max-w-xs")}
          >
            Get Tickets
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
