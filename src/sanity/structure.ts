import type {StructureResolver} from 'sanity/structure'

// Fixed document id for the single Site Settings document.
export const SITE_SETTINGS_ID = 'siteSettings'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id(SITE_SETTINGS_ID)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId(SITE_SETTINGS_ID),
        ),
      S.divider(),
      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('teamMember').title('Team Members'),
    ])
