'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { SocialLink } from '@/sanity/lib/queries'

export function JoinUsSection({ socials }: { socials: SocialLink[] }) {
  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader className="text-center sm:text-left">
        <CardTitle className="text-3xl sm:text-4xl">Join Us</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg text-muted-foreground">
          Interested in becoming a part of our community? Join our society through the free SRC membership and all of our socials!
        </p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
        {socials.map((social) => (
          <Link
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-1 rounded-lg hover:bg-accent transition-colors",
              "w-full"
            )}
          >
            <div className="relative w-12 h-12">
              {social.iconSrc ? (
                <Image
                  src={social.iconSrc}
                  alt={`${social.label} icon`}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                  {social.label.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-sm font-medium">{social.label}</span>
          </Link>
        ))}
      </CardFooter>
    </Card>
  )
}
