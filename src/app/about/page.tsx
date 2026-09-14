import { TextEffect } from '@/components/motion-primitives/text-effect';
import { InView } from '@/components/ui/in-view';
import { TeamSection } from '@/components/ui/TeamSection';
import { SponsorUsSection } from '@/components/ui/SponsorUsSection';
import { getSiteSettings, getTeamMembers } from '@/sanity/lib/queries';

const variants = {
  hidden: {
    opacity: 0,
    y: 20,
  } as const,
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  } as const,
};

export default async function AboutUsPage() {
  const [members, settings] = await Promise.all([getTeamMembers(), getSiteSettings()])

  return (
    <main className="container mx-auto px-4 py-8">
      <InView variants={variants} className="mb-16">
        <TextEffect
          as="h1"
          preset="fade-in-blur"
          className="text-4xl sm:text-5xl font-bold text-center mb-8"
        >
          About Us
        </TextEffect>
        <TextEffect
          as="p"
          preset="blur"
          per="line"
          className="text-lg text-muted-foreground text-center max-w-3xl mx-auto"
        >
          The Glasgow University AI Society is committed to fostering a vibrant community of AI enthusiasts and innovators. Through hands-on workshops, engaging events, and collaborative projects, we aim to demystify artificial intelligence and prepare our members for an AI-driven future.
        </TextEffect>
      </InView>

      <TeamSection members={members} />

      <SponsorUsSection contactEmails={settings.contactEmails} />
    </main>
  )
}
