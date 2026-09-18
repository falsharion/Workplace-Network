import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Triggered by cron-job.org every few minutes. Sends unsynced registrations
// to the Google Sheet in one batch, then marks them as synced.
// cron-job.org waits about 30 seconds for a response, so keep batches small.
const BATCH_SIZE = 100

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? ''
  const providedSecret = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  if (!process.env.CRON_SECRET || providedSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('registrations')
    .select('id, created_at, first_name, last_name, email, phone_number, synced_to_sheet')
    // 'synced_to_sheet' may not be in the generated TypeScript union for column names
    // so cast to any to satisfy the client typing.
    .eq('synced_to_sheet' as any, false)
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE)

  if (error) {
    console.error('Failed to fetch unsynced registrations:', error)
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ synced: 0 })
  }

  const appsScriptUrl = process.env.APPS_SCRIPT_URL
  if (!appsScriptUrl) {
    return NextResponse.json({ error: 'APPS_SCRIPT_URL not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          secret: process.env.APPS_SCRIPT_SECRET,
          // Cast to any[] to avoid TypeScript union issues from the client typings
          rows: (data as any[]).map((r) => ({
            createdAt: r.created_at,
            firstName: r.first_name,
            lastName: r.last_name,
            email: r.email,
            phone: r.phone_number,
          })),
        }),
    })

    const text = await res.text()
    let parsed: { ok?: boolean; error?: string } | null = null
    try {
      parsed = JSON.parse(text)
    } catch {
      // Not JSON, probably a Google HTML page
    }

    // Apps Script returns 200 even on failure, so check the body too
    if (!res.ok || !parsed?.ok) {
      console.error('Apps Script sync failed:', res.status, text.slice(0, 300))
      return NextResponse.json(
        { error: 'Sheet sync failed', detail: parsed?.error ?? 'Non-JSON response' },
        { status: 502 }
      )
    }
  } catch (err) {
    console.error('Apps Script request errored:', err)
    return NextResponse.json({ error: 'Sheet sync errored, will retry next run' }, { status: 502 })
  }

  const ids = (data as any[]).map((r) => r.id)
  const { error: updateError } = await supabase
    .from('registrations')
    // Cast to any to avoid TypeScript excess property checks for generated types
    .update({ synced_to_sheet: true } as any)
    .in('id', ids)

  if (updateError) {
    // Rows will be re-sent next run and appended twice in the sheet.
    // Safe but noisy. Worth checking logs if this keeps happening.
    console.error('Failed to mark rows synced:', updateError)
    return NextResponse.json({ error: 'Marking synced failed' }, { status: 500 })
  }

  return NextResponse.json({ synced: data.length })
}