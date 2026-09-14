import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './client'
import { urlFor } from './image'
import { SITE_SETTINGS_ID } from '../structure'

// Every fetch is tagged with its document type so /api/revalidate can
// clear the right cache when Sanity fires a webhook (see README).

export interface TeamMember {
  _id: string
  name: string
  role: string
  photoUrl?: string
}

interface RawTeamMember {
  _id: string
  name: string
  role: string
  photo?: SanityImageSource
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const query = groq`*[_type == "teamMember"] | order(order asc, name asc){
    _id, name, role, photo
  }`
  try {
    const members = await client.fetch<RawTeamMember[]>(query, {}, { next: { tags: ['teamMember'] } })
    return (members ?? []).map(({ photo, ...m }) => ({
      ...m,
      photoUrl: photo ? urlFor(photo).width(320).height(320).fit('crop').auto('format').url() : undefined,
    }))
  } catch (error) {
    console.error('Failed to fetch team members:', error)
    return []
  }
}

export interface SocialLink {
  label: string
  url: string
  iconSrc?: string
}

export interface SiteSettings {
  membershipLink: string
  contactEmails: string[]
  socials: SocialLink[]
}

// Bundled icons for the platforms offered in the Studio dropdown.
// "Other" has no bundled icon; the editor uploads one.
const PLATFORMS: Record<string, { label: string; iconSrc: string }> = {
  linkedin: { label: 'LinkedIn', iconSrc: '/icons/linkedin.webp' },
  instagram: { label: 'Instagram', iconSrc: '/icons/instagram.webp' },
  discord: { label: 'Discord', iconSrc: '/icons/discord.png' },
  src: { label: 'SRC Membership', iconSrc: '/icons/SRC.png' },
}

// Used until someone fills in Site Settings in the Studio, so a fresh
// deploy still has working buttons.
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  membershipLink: 'https://www.glasgowunisrc.org/organisation/events/',
  contactEmails: ['artificial.intelligence@src.gla.ac.uk', 'aisoc.gu@gmail.com'],
  socials: [
    { ...PLATFORMS.linkedin, url: 'https://www.linkedin.com/company/glasgow-university-artificial-intelligence-society/' },
    { ...PLATFORMS.instagram, url: 'https://www.instagram.com/guaisoc' },
    { ...PLATFORMS.discord, url: 'https://discord.gg/SChyX4WBbK' },
    { ...PLATFORMS.src, url: 'https://www.glasgowunisrc.org/organisation/events/' },
  ],
}

interface RawSiteSettings {
  membershipLink?: string
  contactEmails?: string[]
  socials?: Array<{ platform?: string; label?: string; url?: string; icon?: SanityImageSource }>
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const query = groq`*[_type == "siteSettings" && _id == $id][0]{
    membershipLink, contactEmails, socials
  }`
  try {
    const raw = await client.fetch<RawSiteSettings | null>(
      query,
      { id: SITE_SETTINGS_ID },
      { next: { tags: ['siteSettings'] } },
    )
    if (!raw) return DEFAULT_SITE_SETTINGS

    const socials: SocialLink[] = (raw.socials ?? [])
      .filter((s) => !!s.url)
      .map((s) => {
        const platform = s.platform ? PLATFORMS[s.platform] : undefined
        return {
          label: s.label || platform?.label || 'Link',
          url: s.url as string,
          iconSrc: s.icon
            ? urlFor(s.icon).width(96).height(96).fit('max').auto('format').url()
            : platform?.iconSrc,
        }
      })

    return {
      membershipLink: raw.membershipLink || DEFAULT_SITE_SETTINGS.membershipLink,
      contactEmails: raw.contactEmails?.length ? raw.contactEmails : DEFAULT_SITE_SETTINGS.contactEmails,
      socials: socials.length ? socials : DEFAULT_SITE_SETTINGS.socials,
    }
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    return DEFAULT_SITE_SETTINGS
  }
}
