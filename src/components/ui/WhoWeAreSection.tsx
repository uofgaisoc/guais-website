'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button' // Import buttonVariants
import { cn } from '@/lib/utils'

export function WhoWeAreSection() {
  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader className="text-center sm:text-left">
        <CardTitle className="text-3xl sm:text-4xl">Who We Are</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-lg text-muted-foreground">
        <p>
          The Glasgow University Artificial Intelligence Society (GUAIS) aims to provide hands-on experience with AI technologies, including machine learning, deep learning, and natural language processing. We focus on equipping members with practical skills to develop and utilize AI applications that enhance their academic and personal lives.
        </p>
        <p>
          Our society strives to:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-4">
          <li>Demystify AI</li>
          <li>Promote its responsible use</li>
          <li>Address misconceptions surrounding these technologies</li>
        </ul>
        <p>
          Through workshops, community, and personal projects, we prepare members for an AI-driven future across various disciplines.
        </p>
        <p className="font-semibold">
          Join us today and be part of the AI revolution! Discover new skills, collaborate on exciting projects, and shape the future of technology.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
        <Link
          href="/about#team" // Placeholder, links to /about for now
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "w-full sm:w-auto max-w-xs")}
        >
          Meet the Team
        </Link>
        <Link
          href="/about#sponsors" // Placeholder, links to /about for now
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "w-full sm:w-auto max-w-xs")}
        >
          Sponsor Us
        </Link>
      </CardFooter>
    </Card>
  )
}
