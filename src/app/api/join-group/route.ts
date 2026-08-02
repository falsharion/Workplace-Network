import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { interestFormSchema } from '@/lib/schemas'
import type { Database } from '@/types/database'
import { Resend } from 'resend'

// In-memory rate limiter (per-deployment; use Redis/Upstash for multi-instance)
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 5 // max 5 submissions per IP per minute
const ipMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipMap.get(ip)

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a moment.' },
      { status: 429 }
    )
  }

  // Parse body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Validate
  const result = interestFormSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed.', details: result.error.flatten() },
      { status: 422 }
    )
  }

  // Honeypot check
  const data = result.data
  if (data.website) {
    // Bot detected — return 200 to not tip off bots
    return NextResponse.json({ ok: true })
  }

  const supabase = createAdminClient()

  // Explicit type annotation, so any real field mismatch shows up clearly
  // on this line instead of a confusing collapse to `never` at .insert().
  const payload: Database['public']['Tables']['interest_form_submissions']['Insert'] = {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    phone_number: data.phoneNumber,
    age_range: data.ageRange ?? null,
    years_of_experience: data.yearsOfExperience,
    job_role: data.jobRole || null,
    industry: data.industry || null,
    motivation: data.motivation || null,
    weekly_commitment: data.weeklyCommitment ? data.weeklyCommitment === 'yes' : null,
    preferred_mentor: data.preferredMentor || null,
    mentor_reason: data.mentorReason || null,
    technical_skills: data.technicalSkills,
    soft_skills: data.softSkills,
    workforce_interest: data.workforceInterest ? data.workforceInterest === 'yes' : null,
    workforce_departments: data.workforceDepartments,
    referral_source: data.referralSource ?? null,
  }

  const { error: insertError } = await supabase.from('interest_form_submissions').insert(payload)

  if (insertError) {
    // Unique constraint violation → this email already submitted the form
    if (insertError.code === '23505') {
      return NextResponse.json(
        { error: 'You\u2019ve already submitted an interest form with this email.' },
        { status: 409 }
      )
    }
console.error('Interest form insert error:', insertError)  // ← this is logged, but not sent to the browser
  return NextResponse.json({ error: 'Could not save your submission. Please try again.' }, { status: 500 })
    
  }

  // Send welcome email — non-blocking (don't fail the request if email fails)
  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    resend.emails
      .send({
        from: process.env.RESEND_FROM_EMAIL,
        to: data.email,
        subject: 'Welcome to Workplace Network!',
        html: buildWelcomeEmail({ firstName: data.firstName }),
      })
      .catch((err) => console.error('Resend email error:', err))
  }

  return NextResponse.json({
    ok: true,
    message: 'Your interest form has been submitted!',
  })
}

function buildWelcomeEmail({ firstName }: { firstName: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #E8A33D; font-size: 24px; margin: 0;">workplace</h1>
          <p style="color: #999; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; margin: 4px 0 0;">NEW WORK | NEW WAYS</p>
        </div>

        <h2 style="color: #0B0E14; font-size: 22px; margin-bottom: 8px;">Welcome, ${firstName}! 🎉</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          Thank you for your interest in joining Workplace Network. We've received your
          application and our onboarding team will review it shortly.
        </p>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          Someone from the team will reach out to you directly soon with next steps.
          We're genuinely excited to have you as part of this community.
        </p>

        <div style="margin: 32px 0; padding: 20px; background: #FAF3E8; border-radius: 12px;">
          <p style="margin: 0; font-size: 13px; color: #888;">
            Please do not reply this email it is not monitored. If you have any questions, please contact us at
            <a href="mailto:mail@workplacenetwork.org">mail@workplacenetwork.org</a>
          </p>
        </div>

        <p style="color: #bbb; font-size: 11px; text-align: center; margin-top: 32px;">
          © ${new Date().getFullYear()} Workplace Network. All rights reserved.
        </p>
      </body>
    </html>
  `
}