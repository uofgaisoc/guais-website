import { type SchemaTypeDefinition } from 'sanity'
import event from './event'
import teamMember from './teamMember'
import siteSettings from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [event, teamMember, siteSettings],
}
