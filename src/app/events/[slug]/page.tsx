import React from 'react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, PortableTextComponents } from '@portabletext/react' // For rendering rich text
import { notFound } from 'next/navigation' // For 404 if event not found
import { Button } from '@/components/ui/button' // Import Button
import type { TypedObject } from '@portabletext/types' // Import TypedObject for PortableText

// Define a more specific type for Sanity image objects in arrays
interface SanityImageObjectInArray {
  _type: 'image'; // Sanity image objects in arrays typically have _type: 'image'
  _key: string;
  asset?: { _ref: string; _type: 'reference' }; // Asset is typically a reference
  alt?: string; // Optional alt text
  // Add other common image fields if needed, e.g., hotspot, crop
  [key: string]: unknown; // Allow other properties, use unknown instead of any
}

// Define an interface for the detailed Event data
interface EventDetail {
  _id: string;
  title?: string;
  eventDate?: string;
  eventPageImages?: SanityImageObjectInArray[];
  eventPageLongDescription?: TypedObject[]; // Use TypedObject[] for Portable Text content
  eventPageResources?: Array<{
    _key: string;
    resourceTitle?: string;
    resourceUrl?: string;
  }>;
  slug?: { current?: string };
}

// Function to fetch a single event by its slug
async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  const query = groq`*[_type == "event" && slug.current == $slug][0]{
    _id,
    title,
    eventDate,
    eventPageImages,
    eventPageLongDescription,
    eventPageResources,
    slug
  }`
  try {
    // Add the next-sanity config object with the tag here
    const event = await client.fetch<EventDetail>(query, { slug }, { next: { tags: ['event'] } })
    return event || null
  } catch (error) {
    console.error(`Failed to fetch event with slug "${slug}":`, error)
    return null
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    notFound() // Triggers the 404 page
  }

  // Custom components for PortableText, if needed (e.g., for styling links or images within rich text)
  const ptComponents: Partial<PortableTextComponents> = {
    types: {
      image: ({ value }: { value: SanityImageSource & { alt?: string, asset?: { _ref: string } } }) => {
        // Check if value itself or value.asset is valid for urlFor
        if (!value || !value.asset?._ref) {
          return null
        }
        return (
          <div className="my-6 relative aspect-video">
            <Image
              src={urlFor(value).width(1200).fit('max').auto('format').url()}
              alt={value.alt || event?.title || 'Event image in content'}
              fill
              className="rounded-md object-contain"
            />
          </div>
        )
      },
      // You can add more custom components for other block types if needed
    },
    marks: {
      link: ({children, value}: {children: React.ReactNode, value?: {href?: string, blank?: boolean}}) => {
        const rel = value?.blank ? 'noopener noreferrer' : undefined
        return (
          <a href={value?.href} target={value?.blank ? '_blank' : '_self'} rel={rel} className="text-blue-600 hover:underline dark:text-blue-400">
            {children}
          </a>
        )
      }
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <article className="max-w-3xl mx-auto">
        {event.title && (
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">{event.title}</h1>
        )}
        {event.eventDate && (
          <p className="text-lg text-muted-foreground mb-8 text-center">
            {new Date(event.eventDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

        {/* Display Event Page Images */}
        {event.eventPageImages && event.eventPageImages.length > 0 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.eventPageImages.map((image, index) => (
              <div key={image._key || image.asset?._ref || index} className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                <Image
                  src={urlFor(image).width(800).fit('max').url()}
                  alt={`${event.title || 'Event'} image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Display Long Description (Rich Text) */}
        {event.eventPageLongDescription && (
          <div className="prose dark:prose-invert lg:prose-xl max-w-none mx-auto mb-8">
            <PortableText value={event.eventPageLongDescription} components={ptComponents} />
          </div>
        )}

        {/* Display Resources */}
        {event.eventPageResources && event.eventPageResources.length > 0 && (
          <section className="mb-8 p-6 border rounded-lg bg-muted/30">
            <h2 className="text-2xl font-semibold mb-4">Resources</h2>
            <ul className="list-disc pl-5 space-y-2">
              {event.eventPageResources.map((resource) => (
                resource.resourceUrl && resource.resourceTitle && (
                  <li key={resource._key}>
                    <a
                      href={resource.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {resource.resourceTitle}
                    </a>
                  </li>
                )
              ))}
            </ul>
          </section>
        )}
         <div className="mt-12 text-center">
            <Button asChild variant="outline">
                <Link href="/events">
                    &larr; Back to All Past Events
                </Link>
            </Button>
        </div>
      </article>
    </main>
  )
}

// Optional: Function to generate static paths if using SSG for events
// export async function generateStaticParams() {
//   // Fetch all event slugs from Sanity
//   // const events = await client.fetch<Array<{slug: {current: string}}>>(`*[_type == "event" && defined(slug.current)]{ "slug": slug.current }`);
//   // return events.map((event) => ({ slug: event.slug.current }));
//   return [];
// }
