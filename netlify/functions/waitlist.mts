import type { Config } from '@netlify/functions'
import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { waitlistSignups } from '../../db/schema.js'

const emailSchema = z.string().trim().toLowerCase().email().max(254)

async function countSignups() {
  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(waitlistSignups)
  return row?.count ?? 0
}

export default async (req: Request) => {
  if (req.method === 'GET') {
    const count = await countSignups()
    return Response.json({ count })
  }

  if (req.method === 'POST') {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return Response.json({ error: 'Malformed request.' }, { status: 400 })
    }

    const { email: rawEmail, website } =
      (body as { email?: unknown; website?: unknown }) ?? {}

    // Honeypot field — bots fill every input, real users never see it.
    if (typeof website === 'string' && website.length > 0) {
      return Response.json({ ok: true, count: await countSignups() })
    }

    const parsed = emailSchema.safeParse(rawEmail)
    if (!parsed.success) {
      return Response.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }

    try {
      await db.insert(waitlistSignups).values({ email: parsed.data }).onConflictDoNothing()
    } catch (err) {
      console.error('waitlist insert failed', err)
      return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }

    return Response.json({ ok: true, count: await countSignups() })
  }

  return new Response('Method not allowed', { status: 405 })
}

export const config: Config = {
  path: '/api/waitlist',
  method: ['GET', 'POST'],
}
