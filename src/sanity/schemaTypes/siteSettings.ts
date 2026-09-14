import {defineArrayMember, defineField, defineType} from 'sanity'

const PLATFORM_TITLES = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  discord: 'Discord',
  src: 'SRC Membership',
  other: 'Other',
}

// One document only. The Studio structure pins it to the top of the sidebar
// and sanity.config.ts stops people creating a second one.
export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'membershipLink',
      title: 'Membership link',
      type: 'url',
      description: 'Where the "Become a member" buttons go (usually the SRC page).',
    }),
    defineField({
      name: 'contactEmails',
      title: 'Contact emails',
      type: 'array',
      of: [defineArrayMember({type: 'string', validation: (Rule) => Rule.email()})],
      description: 'Shown in the Sponsor Us section on the About page.',
    }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      description:
        'Shown in the Join Us section on the homepage. Pick a platform and the icon is added for you; only "Other" needs its own icon.',
      of: [
        defineArrayMember({
          name: 'social',
          title: 'Social link',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Discord', value: 'discord'},
                  {title: 'SRC Membership', value: 'src'},
                  {title: 'Other', value: 'other'},
                ],
                layout: 'dropdown',
              },
              initialValue: 'other',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Optional. Leave empty to use the platform name.',
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              description: 'Only needed for "Other". Square PNG/WebP works best.',
              hidden: ({parent}) => parent?.platform !== 'other',
            }),
          ],
          preview: {
            select: {platform: 'platform', label: 'label', url: 'url', media: 'icon'},
            prepare: ({platform, label, url, media}) => ({
              title: label || PLATFORM_TITLES[platform as keyof typeof PLATFORM_TITLES] || 'Social link',
              subtitle: url,
              media,
            }),
          },
        }),
      ],
      initialValue: [
        {_type: 'social', platform: 'linkedin', url: 'https://www.linkedin.com/company/glasgow-university-artificial-intelligence-society/'},
        {_type: 'social', platform: 'instagram', url: 'https://www.instagram.com/guaisoc'},
        {_type: 'social', platform: 'discord', url: 'https://discord.gg/SChyX4WBbK'},
        {_type: 'social', platform: 'src', url: 'https://www.glasgowunisrc.org/organisation/events/'},
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site Settings'}),
  },
})
