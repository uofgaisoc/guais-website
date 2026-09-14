import {defineArrayMember, defineField, defineType} from 'sanity'

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
      description: 'Shown in the Join Us section on the homepage.',
      of: [
        defineArrayMember({
          name: 'social',
          title: 'Social link',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'url', title: 'URL', type: 'url', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              description: 'Square PNG/WebP works best.',
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'url', media: 'icon'},
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site Settings'}),
  },
})
