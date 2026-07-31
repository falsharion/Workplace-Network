'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { MentorOption } from '@/lib/mentors.server'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'


type Status = 'idle' | 'submitting' | 'success'

const STORAGE_KEY = 'wpn_interest_form_draft_v1'

const AGE_RANGE_OPTIONS = [
  { value: 'under-18', label: 'Under 18' },
  { value: '18-24', label: '18–24' },
  { value: '25-34', label: '25–34' },
  { value: '35-44', label: '35–44' },
  { value: '45-plus', label: '45+' },
]

const EXPERIENCE_OPTIONS = [
  { value: 'under-5', label: 'less 5 years' },
  { value: '5-9', label: '5 - 9 years' },
  { value: '10-plus', label: '10+ years' },
]

const REFERRAL_OPTIONS = [
  { value: 'social-media', label: 'Social Media (LinkedIn, Instagram, X)' },
  { value: 'friend-colleague', label: 'Friend/Colleague' },
  { value: 'wpn-conference', label: 'WPN Conference' },
  { value: 'website', label: 'Website' },
  { value: 'other', label: 'Other' },
]

const DEPARTMENT_OPTIONS = [
  { value: 'tech', label: 'Tech Team' },
  { value: 'media-comms', label: 'Media & Comms' },
  { value: 'onboarding', label: 'Onboarding Team' },
  { value: 'admin', label: 'Admin Team' },
  { value: 'conference', label: 'Conference Team' },
  { value: 'outreach', label: 'Outreach Team' },
]

const INDUSTRY_OPTIONS = [
  { value: 'tech', label: 'Tech' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'creative', label: 'Creative' },
  { value: 'energy', label: 'Energy' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'government', label: 'Government / Public Sector' },
  { value: 'non-profit', label: 'Non-profit' },
  { value: 'other', label: 'Other' },
]

const COUNTRY_CODES = [
  { code: '+234', iso: 'NG', country: 'Nigeria' },
  { code: '+1', iso: 'US', country: 'US/Canada' },
  { code: '+44', iso: 'UK', country: 'United Kingdom' },
  { code: '+233', iso: 'GH', country: 'Ghana' },
  { code: '+254', iso: 'KE', country: 'Kenya' },
  { code: '+27', iso: 'ZA', country: 'South Africa' },
  { code: '+256', iso: 'UG', country: 'Uganda' },
  { code: '+255', iso: 'TZ', country: 'Tanzania' },
  { code: '+20', iso: 'EG', country: 'Egypt' },
  { code: '+91', iso: 'IN', country: 'India' },
  { code: '+353', iso: 'IE', country: 'Ireland' },
  { code: '+61', iso: 'AU', country: 'Australia' },
  { code: '+971', iso: 'AE', country: 'UAE' },
  { code: '+49', iso: 'DE', country: 'Germany' },
  { code: '+33', iso: 'FR', country: 'France' },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface SubmitResult {
  ok: boolean
  data: { error?: string; [key: string]: unknown }
}

/**
 * POSTs the form with automatic retries. Only retries on real network
 * failures (fetch throws — the request never reached the server) or a
 * 5xx response (server-side trouble). Validation errors (422), duplicate
 * email (409), and rate limiting (429) are the server telling us
 * something real — retrying blindly won't fix those, so those return
 * immediately instead.
 */
async function submitWithRetry(
  payload: Record<string, unknown>,
  onRetry: (attempt: number, maxAttempts: number) => void,
  maxAttempts = 3
): Promise<SubmitResult> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch('/api/join-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status < 500) {
        const data = await res.json()
        return { ok: res.ok, data }
      }

      if (attempt === maxAttempts) {
        const data = await res.json().catch(() => ({}))
        return { ok: false, data }
      }
    } catch {
      // Network-level failure — the request never reached the server
      if (attempt === maxAttempts) {
        return { ok: false, data: { error: 'Check your connection and try again.' } }
      }
    }

    onRetry(attempt + 1, maxAttempts)
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000)) // 1s, then 2s
  }

  return { ok: false, data: { error: 'Something went wrong. Please try again.' } }
}

const labelClasses = 'block text-sm font-medium text-gray-900 mb-1.5'

function inputClasses(hasError?: boolean) {
  return `w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 disabled:bg-gray-50 transition-colors duration-200 ${
    hasError ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-amber-300'
  }`
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-red-500">{message}</p>
}

interface TagInputProps {
  label: string
  placeholder: string
  values: string[]
  onChange: (values: string[]) => void
  disabled?: boolean
}

function TagInput({ label, placeholder, values, onChange, disabled }: TagInputProps) {
  const [draft, setDraft] = useState('')

  function commitDraft() {
    const trimmed = draft.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
    }
    setDraft('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commitDraft()
    } else if (e.key === 'Backspace' && !draft && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  return (
    <div>
      <label className={labelClasses}>{label}</label>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 focus-within:ring-2 focus-within:ring-amber-300">
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 text-sm px-3 py-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(values.filter((v) => v !== tag))}
              className="text-amber-600 hover:text-amber-900"
              aria-label={`Remove ${tag}`}
              disabled={disabled}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={values.length === 0 ? placeholder : ''}
          disabled={disabled}
          className="flex-1 min-w-[120px] outline-none text-gray-900 placeholder-gray-400 py-1 disabled:bg-transparent"
        />
      </div>
      <p className="mt-1 text-xs text-gray-400">Press Enter or comma to add (optional)</p>
    </div>
  )
}

interface YesNoToggleProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function YesNoToggle({ value, onChange, disabled }: YesNoToggleProps) {
  return (
    <div className="flex gap-3">
      {['yes', 'no'].map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option)}
          className={`flex-1 rounded-xl border py-3 font-medium capitalize transition-colors duration-200 ${
            value === option
              ? 'border-amber-300 bg-amber-50 text-gray-900'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

interface RadioRowProps {
  name: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function RadioRow({ name, value, onChange, disabled }: RadioRowProps) {
  return (
    <div className="flex gap-6">
      {['yes', 'no'].map((option) => (
        <label key={option} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            disabled={disabled}
            className="h-4 w-4 accent-amber-400"
          />
          <span className="text-sm text-gray-700 capitalize">{option}</span>
        </label>
      ))}
    </div>
  )
}

interface DraftState {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  ageRange: string
  yearsOfExperience: string
  jobRole: string
  industry: string
  industryOther: string
  motivation: string
  weeklyCommitment: string
  preferredMentor: string
  mentorReason: string
  technicalSkills: string[]
  softSkills: string[]
  workforceInterest: string
  workforceDepartments: string[]
  referralSource: string
}

interface InterestFormProps {
  initialYearsOfExperience?: string
  mentors: MentorOption[]
}

export function InterestForm({ initialYearsOfExperience, mentors }: InterestFormProps) {
  const router = useRouter()
  const hasHydrated = useRef(false)

  const [step, setStep] = useState<1 | 2>(1)
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [retryAttempt, setRetryAttempt] = useState(0)
  const [website, setWebsite] = useState('') // honeypot

  // Step 1 — required: email, firstName, lastName, phone, yearsOfExperience
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
const [phoneNumber, setPhoneNumber] = useState('')
  const [yearsOfExperience, setYearsOfExperience] = useState(initialYearsOfExperience ?? '')
  // Step 1 — optional
  const [ageRange, setAgeRange] = useState('')
  const [jobRole, setJobRole] = useState('')
  const [industry, setIndustry] = useState('')
  const [industryOther, setIndustryOther] = useState('')
  const [motivation, setMotivation] = useState('')
  const [weeklyCommitment, setWeeklyCommitment] = useState('')

  // Step 2 — all optional
  const [preferredMentor, setPreferredMentor] = useState('')
  const [mentorReason, setMentorReason] = useState('')
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([])
  const [softSkills, setSoftSkills] = useState<string[]>([])
  const [workforceInterest, setWorkforceInterest] = useState('')
  const [workforceDepartments, setWorkforceDepartments] = useState<string[]>([])
  const [referralSource, setReferralSource] = useState('')

  // Restore any saved draft on mount (guards against losing progress to a
  // dropped connection, an accidental refresh, or a closed tab).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const draft = JSON.parse(raw) as Partial<DraftState>
        if (draft.email) setEmail(draft.email)
        if (draft.firstName) setFirstName(draft.firstName)
        if (draft.lastName) setLastName(draft.lastName)
        if (draft.phoneNumber) setPhoneNumber(draft.phoneNumber)
        if (draft.ageRange) setAgeRange(draft.ageRange)
        if (draft.yearsOfExperience && !initialYearsOfExperience) {
          setYearsOfExperience(draft.yearsOfExperience)
        }
        if (draft.jobRole) setJobRole(draft.jobRole)
        if (draft.industry) setIndustry(draft.industry)
        if (draft.industryOther) setIndustryOther(draft.industryOther)
        if (draft.motivation) setMotivation(draft.motivation)
        if (draft.weeklyCommitment) setWeeklyCommitment(draft.weeklyCommitment)
        if (draft.preferredMentor) setPreferredMentor(draft.preferredMentor)
        if (draft.mentorReason) setMentorReason(draft.mentorReason)
        if (draft.technicalSkills?.length) setTechnicalSkills(draft.technicalSkills)
        if (draft.softSkills?.length) setSoftSkills(draft.softSkills)
        if (draft.workforceInterest) setWorkforceInterest(draft.workforceInterest)
        if (draft.workforceDepartments?.length) setWorkforceDepartments(draft.workforceDepartments)
        if (draft.referralSource) setReferralSource(draft.referralSource)
      }
    } catch (err) {
      console.error('Could not restore saved draft:', err)
    } finally {
      hasHydrated.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save a draft on every change, once hydration has happened, so a dropped
  // connection or accidental refresh doesn't lose what's been filled in.
  useEffect(() => {
    if (!hasHydrated.current || status === 'success') return
    const draft: DraftState = {
      email,
      firstName,
      lastName,
      phoneNumber,
      ageRange,
      yearsOfExperience,
      jobRole,
      industry,
      industryOther,
      motivation,
      weeklyCommitment,
      preferredMentor,
      mentorReason,
      technicalSkills,
      softSkills,
      workforceInterest,
      workforceDepartments,
      referralSource,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch (err) {
      console.error('Could not save draft:', err)
    }
  }, [
    email,
    firstName,
    lastName,
    phoneNumber,
    ageRange,
    yearsOfExperience,
    jobRole,
    industry,
    industryOther,
    motivation,
    weeklyCommitment,
    preferredMentor,
    mentorReason,
    technicalSkills,
    softSkills,
    workforceInterest,
    workforceDepartments,
    referralSource,
    status,
  ])

  useEffect(() => {
    if (status !== 'success') return
    const timeout = setTimeout(() => router.push('/'), 3500)
    return () => clearTimeout(timeout)
  }, [status, router])

  function toggleDepartment(value: string) {
    setWorkforceDepartments((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  function validateRequiredFields(): Record<string, string> {
    const errors: Record<string, string> = {}
    if (!email.trim()) errors.email = 'Email is required'
    else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address'
    if (!firstName.trim()) errors.firstName = 'First name is required'
    if (!lastName.trim()) errors.lastName = 'Last name is required'
     if (!phoneNumber) {
    errors.phoneNumber = 'Phone number is required'
  } else if (!isValidPhoneNumber(phoneNumber)) {
    errors.phoneNumber = 'Enter a valid phone number'
  }
    if (!yearsOfExperience) errors.yearsOfExperience = 'Select your years of experience'
    return errors
  }

  function handleNext() {
    const errors = validateRequiredFields()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    setServerError(null)
    setStep(2)
  }

  function handleBack() {
    setStep(1)
  }
function handleFormKeyDown(e: KeyboardEvent<HTMLFormElement>) {
  if (e.key !== 'Enter') return
  const target = e.target as HTMLElement
  if (target.tagName === 'TEXTAREA') return // let Enter make newlines in textareas
  e.preventDefault()
  if (step === 1) handleNext()
}
  function resolvedIndustry(): string {
    if (industry === 'other') return industryOther.trim()
    return INDUSTRY_OPTIONS.find((opt) => opt.value === industry)?.label ?? ''
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (status === 'submitting') return 
    const errors = validateRequiredFields()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      setStep(1)
      return
    }

    setServerError(null)
    setStatus('submitting')
    setRetryAttempt(0)

    const payload = {
      email,
      firstName,
      lastName,
      phoneNumber,
      ageRange: ageRange || undefined,
      yearsOfExperience,
      jobRole,
      industry: resolvedIndustry(),
      motivation,
      weeklyCommitment: weeklyCommitment || undefined,
      preferredMentor,
      mentorReason,
      technicalSkills,
      softSkills,
      workforceInterest: workforceInterest || undefined,
      workforceDepartments,
      referralSource: referralSource || undefined,
      website,
    }

    const { ok, data } = await submitWithRetry(payload, (attempt) => setRetryAttempt(attempt))

    setRetryAttempt(0)

    if (!ok) {
      setServerError(
        typeof data.error === 'string'
          ? data.error
          : 'That didn\u2019t go through after a few tries. Your answers are saved on this device — try again when you\u2019re back online.'
      )
      setStatus('idle')
      return
    }

    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Non-critical — the draft will just get overwritten next time
    }

    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-md mx-auto text-center animate-[fadeIn_0.4s_ease-in-out]">
        <Image
          src="/assets/Logo(white).svg"
          alt="Workplace Network"
          width={160}
          height={48}
          className="mx-auto mb-8"
        />
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 13l4 4L19 7"
              stroke="#E8A33D"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {firstName}!</h1>
        <p className="text-gray-500 leading-relaxed">
          Thanks for your interest in Workplace Network. Our onboarding team will review your
          application and reach out to you by email soon. Taking you back home now.
        </p>
      </div>
    )
  }

  const disabled = status === 'submitting'

  return (
    <div className="w-full max-w-xl mx-auto">
      <Image
        src="/assets/Logo(white).svg"
        alt="Workplace Network"
        width={160}
        height={48}
        className="mx-auto mb-8"
      />

      <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Join Community</h1>
      <p className="text-gray-500 text-center mb-6">Tell us a bit about yourself</p>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
            step >= 1 ? 'bg-amber-300 text-gray-900' : 'bg-gray-100 text-gray-400'
          }`}
        >
          1
        </div>
        <div
          className={`h-0.5 w-10 transition-colors duration-300 ${
            step >= 2 ? 'bg-amber-300' : 'bg-gray-200'
          }`}
        />
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
            step >= 2 ? 'bg-amber-300 text-gray-900' : 'bg-gray-100 text-gray-400'
          }`}
        >
          2
        </div>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Sliding two-panel container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
          >
            {/* ── Step 1: About You ── */}
            <div className="w-full shrink-0 pr-1 space-y-5">
              <div>
                <label className={labelClasses}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => {
                    if (email && !EMAIL_PATTERN.test(email.trim())) {
                      setFieldErrors((prev) => ({ ...prev, email: 'Enter a valid email address' }))
                    } else {
                      setFieldErrors((prev) => ({ ...prev, email: '' }))
                    }
                  }}
                  placeholder="Enter your email address"
                  className={inputClasses(!!fieldErrors.email)}
                  disabled={disabled}
                />
                <FieldError message={fieldErrors.email} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className={inputClasses(!!fieldErrors.firstName)}
                    disabled={disabled}
                  />
                  <FieldError message={fieldErrors.firstName} />
                </div>
                <div>
                  <label className={labelClasses}>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className={inputClasses(!!fieldErrors.lastName)}
                    disabled={disabled}
                  />
                  <FieldError message={fieldErrors.lastName} />
                </div>
              </div>

<div>
  <label className={labelClasses}>Phone Number</label>

  <PhoneInput
    international
    defaultCountry="NG"
    value={phoneNumber}
    onChange={(value) => setPhoneNumber(value ?? '')}
    placeholder="Enter phone number"
    disabled={disabled}
    className="phone-input"
  />

  <FieldError message={fieldErrors.phoneNumber} />
</div>

              <div>
                <label className={labelClasses}>Age Range</label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className={`${inputClasses(false)} bg-white`}
                  disabled={disabled}
                >
                  <option value="">Select your age range (optional)</option>
                  {AGE_RANGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Years of Experience</label>
                <select
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className={`${inputClasses(!!fieldErrors.yearsOfExperience)} bg-white`}
                  disabled={disabled}
                >
                  <option value="" disabled>
                    Select your years of experience
                  </option>
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FieldError message={fieldErrors.yearsOfExperience} />
              </div>

              <div>
                <label className={labelClasses}>Job Role / Title</label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Software Engineer, Product Manager, Accountant (optional)"
                  className={inputClasses(false)}
                  disabled={disabled}
                />
              </div>

              <div>
                <label className={labelClasses}>Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={`${inputClasses(false)} bg-white`}
                  disabled={disabled}
                >
                  <option value="">Select an industry (optional)</option>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    industry === 'other' ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'
                  }`}
                >
                  <input
                    type="text"
                    value={industryOther}
                    onChange={(e) => setIndustryOther(e.target.value)}
                    placeholder="Tell us your industry"
                    className={inputClasses(false)}
                    disabled={disabled}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Why would you like to be part of WPN?</label>
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Tell us what draws you to the community (optional)"
                  rows={4}
                  className={`${inputClasses(false)} resize-none`}
                  disabled={disabled}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  Are you willing to commit 2–4 hours per week to WPN activities?
                </label>
                <RadioRow name="weeklyCommitment" value={weeklyCommitment} onChange={setWeeklyCommitment} disabled={disabled} />
              </div>
            </div>

            {/* ── Step 2: Mentorship & Skills ── */}
            <div className="w-full shrink-0 pl-1 space-y-5">
              <div>
                <label className={labelClasses}>Preferred Mentor</label>
                <select
                  value={preferredMentor}
                  onChange={(e) => setPreferredMentor(e.target.value)}
                  className={`${inputClasses(false)} bg-white`}
                  disabled={disabled}
                >
                  <option value="">No preference</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.name}>
                      {mentor.name}
                      {/* {mentor.title ? ` — ${mentor.title}` : ''} */}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Reason for Chosen Mentor</label>
                <textarea
                  value={mentorReason}
                  onChange={(e) => setMentorReason(e.target.value)}
                  placeholder="Why does this mentor fit your career goals? (optional)"
                  rows={3}
                  className={`${inputClasses(false)} resize-none`}
                  disabled={disabled}
                />
              </div>

              <TagInput
                label="Technical Skills"
                placeholder="e.g. Data Analysis, Python, Financial Modeling"
                values={technicalSkills}
                onChange={setTechnicalSkills}
                disabled={disabled}
              />

              <TagInput
                label="Soft Skills"
                placeholder="e.g. Communication, Leadership, Public Speaking"
                values={softSkills}
                onChange={setSoftSkills}
                disabled={disabled}
              />

              <div>
                <label className={labelClasses}>Would you like to be part of the WPN workforce?</label>
                <YesNoToggle value={workforceInterest} onChange={setWorkforceInterest} disabled={disabled} />
              </div>

              {/* Conditional field, smooth expand/collapse */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  workforceInterest === 'yes' ? 'max-h-[260px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <label className={labelClasses}>Preferred Workforce Department</label>
                <div className="grid grid-cols-2 gap-2">
                  {DEPARTMENT_OPTIONS.map((dept) => {
                    const checked = workforceDepartments.includes(dept.value)
                    return (
                      <label
                        key={dept.value}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer transition-colors duration-200 ${
                          checked
                            ? 'border-amber-300 bg-amber-50 text-gray-900'
                            : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDepartment(dept.value)}
                          className="accent-amber-400"
                          disabled={disabled}
                        />
                        {dept.label}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className={labelClasses}>How did you hear about us?</label>
                <select
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                  className={`${inputClasses(false)} bg-white`}
                  disabled={disabled}
                >
                  <option value="">Select an option (optional)</option>
                  {REFERRAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {retryAttempt > 0 && (
          <p className="text-xs text-gray-400 text-center mt-4">
            Connection hiccup — retrying ({retryAttempt} of 3)...
          </p>
        )}

        {serverError && <p className="text-sm text-red-500 text-center mt-4">{serverError}</p>}

        <div className="flex gap-3 mt-6">
          {step === 2 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={disabled}
              className="flex-1 rounded-full border border-gray-200 text-gray-700 font-semibold py-3.5 hover:bg-gray-50 transition-colors duration-200"
            >
              Back
            </button>
          )}

{step === 1 ? (
  <button
    key="next"
    type="button"
    onClick={handleNext}
    className="flex-1 rounded-full bg-amber-300 hover:bg-amber-400 text-gray-900 font-semibold py-3.5 transition-colors duration-200"
  >
    Next
  </button>
) : (
  <button
    key="submit"
    type="submit"
    disabled={disabled}
    className="flex-1 rounded-full bg-amber-300 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 font-semibold py-3.5 transition-colors duration-200 flex items-center justify-center gap-2"
  >
    {disabled && (
      <svg className="animate-spin h-4 w-4 text-gray-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    )}
    {disabled ? 'Submitting...' : 'Submit'}
  </button>
)}
        </div>
      </form>
    </div>
  )
}