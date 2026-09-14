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

// Used until someone fills in Site Settings in the Studio, so a fresh
// deploy still has working buttons.
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  membershipLink: 'https://www.glasgowunisrc.org/organisation/events/',
  contactEmails: ['artificial.intelligence@src.gla.ac.uk', 'aisoc.gu@gmail.com'],
  socials: [
    { label: 'LinkedIn', iconSrc: '/icons/linkedin.webp', url: 'https://www.linkedin.com/company/glasgow-university-artificial-intelligence-society/' },
    { label: 'Instagram', iconSrc: '/icons/instagram.webp', url: 'https://www.instagram.com/guaisoc' },
    { label: 'Discord', iconSrc: '/icons/discord.png', url: 'https://discord.gg/SChyX4WBbK' },
    { label: 'SRC Membership', iconSrc: '/icons/SRC.png', url: 'https://www.glasgowunisrc.org/organisation/events/' },
  ],
}

interface RawSiteSettings {
  membershipLink?: string
  contactEmails?: string[]
  socials?: Array<{ label?: string; url?: string; icon?: SanityImageSource }>
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

    const socials = (raw.socials ?? [])
      .filter((s): s is { label: string; url: string; icon?: SanityImageSource } => !!s.label && !!s.url)
      .map((s) => ({
        label: s.label,
        url: s.url,
        iconSrc: s.icon ? urlFor(s.icon).width(96).height(96).fit('max').auto('format').url() : undefined,
      }))

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
