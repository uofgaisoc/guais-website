import { TextEffect } from '@/components/motion-primitives/text-effect';
import { InView } from '@/components/ui/in-view';
import Link from 'next/link';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function SponsorUsSection({ contactEmails }: { contactEmails: string[] }) {
  return (
    <div id="sponsor-us"> {/* For the anchor link */}
      <InView
        as="section"
        variants={sectionVariants}
        viewOptions={{ once: true, amount: 0.1 }}
        className="py-12 sm:py-16" // Consistent padding
      >
      <TextEffect
        as="h2"
        preset="fade-in-blur"
        className="text-3xl sm:text-4xl font-bold text-center mb-8"
      >
        Sponsor Us
      </TextEffect>

      <TextEffect
        as="p"
        preset="blur"
        per="line"
        className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-6"
      >
        Partnering with the Glasgow University Artificial Intelligence Society offers a unique opportunity to connect with a thriving community of students passionate about the future of technology. As a new society, your support is crucial in helping us build a strong foundation.
      </TextEffect>

      <TextEffect
        as="p"
        preset="blur"
        per="line"
        className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-10"
      >
        Our events provide a direct channel to mentor and interact with future talent as they tackle exciting challenges in the world of AI.
      </TextEffect>

      <div className="max-w-3xl mx-auto">
        <TextEffect
          as="h3"
          preset="fade-in-blur"
          className="text-2xl font-semibold text-center mb-6"
        >
          As a sponsor, you will have the platform to:
        </TextEffect>
        <ul className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { title: "Present at Our Events", description: "Deliver a keynote or presentation at one of our events, giving you a platform to share your company's vision and work with an engaged audience." },
            { title: "Host Workshops", description: "Collaborate with us to run hands-on workshops, allowing you to guide students through practical applications and identify promising talent." },
            { title: "Showcase Your Brand", description: "Your company will be prominently featured at our events and on our social media channels, providing a dedicated space for students to learn more about your opportunities." },
          ].map((item, index) => (
            <InView
              key={index}
              as="li"
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, delay: 0.1 * index, ease: "easeOut" } },
              }}
              viewOptions={{ once: true, amount: 0.3 }}
              className="p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out flex flex-col"
            >
              {/* Plain text here: the card itself animates, so animating the text too made it flicker */}
              <h4 className="text-xl font-semibold mb-2 text-card-foreground">{item.title}</h4>
              <p className="text-sm text-card-foreground/80 flex-grow">{item.description}</p>
            </InView>
          ))}
        </ul>

        <TextEffect
          as="h3"
          preset="fade-in-blur"
          className="text-2xl font-semibold text-center mb-4"
        >
          Contact us:
        </TextEffect>
        <div className="text-center space-y-2">
          {contactEmails.map((email) => (
            <Link key={email} href={`mailto:${email}`} className="hover:text-primary transition-colors duration-200 block">
              <TextEffect preset="blur" per="line" className="text-lg text-muted-foreground">
                {email}
              </TextEffect>
            </Link>
          ))}
        </div>
      </div>
    </InView>
  </div>
  );
}