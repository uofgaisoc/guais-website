import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'Past', value: 'past'},
        ],
        layout: 'radio', // or 'dropdown'
      },
      initialValue: 'upcoming',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Is Featured?',
      type: 'boolean',
      description: 'Feature this event on the homepage, potentially overriding default logic.',
      initialValue: false,
    }),
    // Fields for "Upcoming" Event Display (Homepage)
    defineField({
      name: 'homepageBanner',
      title: 'Homepage Banner',
      type: 'image',
      options: {
        hotspot: true, // Enables image cropping
      },
      description: 'Banner image for the event when displayed on the homepage.',
      hidden: ({document}) => document?.status === 'past',
    }),
    defineField({
      name: 'homepageShortDescription',
      title: 'Short Description (Homepage/Event Card)',
      type: 'array', // Changed from 'text' to 'array' for Portable Text
      of: [
        {
          type: 'block',
          styles: [ // Minimal styles for a short description
            {title: 'Normal', value: 'normal'},
          ],
          lists: [], // No lists for short description
          marks: { // Allow basic marks like bold, italic
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [ // Simple links if needed
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  { title: 'Open in new tab', name: 'blank', type: 'boolean', initialValue: true },
                ],
              },
            ],
          },
        },
      ],
      description: 'A brief description for the homepage and event cards. Supports newlines and basic formatting.',
      // hidden callback removed to make it always visible
    }),
    defineField({
      name: 'ticketLink',
      title: 'Ticket Link',
      type: 'url',
      description: 'Link to tickets or registration.',
      hidden: ({document}) => document?.status === 'past',
    }),
    // Fields for "Past" Event Display (Events Page)
    defineField({
      name: 'eventPageImages',
      title: 'Event Page Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      description: 'Images to showcase what happened at the event.',
      hidden: ({document}) => document?.status === 'upcoming',
    }),
    defineField({
      name: 'eventPageLongDescription',
      title: 'Event Page Long Description',
      type: 'array', // Using array for block content (rich text)
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
      ],
      description: 'A detailed description of the event for the events page.',
      hidden: ({document}) => document?.status === 'upcoming',
    }),
    defineField({
      name: 'eventPageResources',
      title: 'Event Page Resources',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'resource',
          title: 'Resource',
          type: 'object',
          fields: [
            defineField({name: 'resourceTitle', title: 'Resource Title', type: 'string'}),
            defineField({name: 'resourceUrl', title: 'Resource URL', type: 'url'}),
          ],
        }),
      ],
      description: 'Links to useful resources related to the event.',
      hidden: ({document}) => document?.status === 'upcoming',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'eventDate',
      media: 'homepageBanner',
      status: 'status',
    },
    prepare(selection) {
      const {title, date, media, status} = selection
      const eventDate = date ? new Date(date).toLocaleDateString() : 'No date'
      return {
        title: title,
        subtitle: `${eventDate} - ${status?.toUpperCase() || 'NO STATUS'}`,
        media: media,
      }
    },
  },
})

