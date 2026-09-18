import { NextRequest, NextResponse } from 'next/server'
import { registrationSchema } from '@/lib/schemas'
import { createAdminClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

// Basic in-memory rate limit. Fine for a single serverless instance.
// If you scale to multiple regions/instances, swap for Upstash/Redis.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5
const hits = new Map<string, { count: number; resetAt: number }>()

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isRateLimited(ip: string) {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT_MAX
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const result = registrationSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
  }

  // Honeypot tripped: pretend success, don't insert.
  if (result.data.website) {
    return NextResponse.json({ ok: true })
  }

  const eventId = typeof body.eventId === 'string' ? body.eventId.trim() : ''
  if (!eventId || !UUID_RE.test(eventId)) {
    return NextResponse.json({ error: 'Missing event.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Check the event exists and registration is still open.
  // Server time and the registration_open flag are the source of truth.
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, start_at, registration_open')
    .eq('id', eventId)
    .maybeSingle()

  if (eventError) {
    console.error('Event lookup failed:', eventError)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  if (!event) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
  }

  if (!event.registration_open || new Date(event.start_at) <= new Date()) {
    return NextResponse.json(
      { error: 'Registration is closed for this event.' },
      { status: 403 }
    )
  }

  const payload: Database['public']['Tables']['registrations']['Insert'] = {
    event_id: eventId,
    first_name: result.data.firstName,
    last_name: result.data.lastName,
    email: result.data.email,
    phone_number: result.data.phoneNumber,
    synced_to_sheet: false,
  }

  const { error } = await supabase.from('registrations').insert(payload)

  if (error) {
    // Postgres unique_violation: same email already registered for this event
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'This email is already registered for this event.' },
        { status: 409 }
      )
    }
    console.error('Registration insert failed:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}