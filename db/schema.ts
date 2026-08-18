import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const waitlistSignups = pgTable('waitlist_signups', {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})
