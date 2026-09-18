'use client'
import { useState, useRef, useId } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { registrationSchema } from '@/lib/schemas'

interface RegistrationFormProps {
  eventId: string
  disabled?: boolean
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  privacyPolicy: boolean
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  privacyPolicy?: string
  general?: string
}

export function RegistrationForm({ eventId, disabled = false }: RegistrationFormProps) {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [values, setValues] = useState<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    privacyPolicy: false,
  })
const uid = useId()
  // Honeypot — hidden from users, visible to bots
  const honeypotRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (honeypotRef.current?.value) return

    const result = registrationSchema.safeParse({
      ...values,
      website: honeypotRef.current?.value ?? '',
    })

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setState('loading')
    setErrors({})

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, eventId }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (res.status === 409) {
          setErrors({ general: 'This email is already registered for this event.' })
        } else if (res.status === 429) {
          setErrors({ general: 'Too many requests. Please try again in a moment.' })
        } else {
          setErrors({ general: data.error ?? 'Something went wrong. Please try again.' })
        }
        setState('error')
        return
      }

      setState('success')
    } catch {
      setErrors({ general: 'Network error. Please check your connection and try again.' })
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-6">
        <CheckCircle size={40} className="text-green-500" />
        <p className="text-white font-semibold">You&apos;re registered!</p>
        <p className="text-white/60 text-sm">We can't wait to worship and give thanks with you</p>
      </div>
    )
  }

  const isDisabled = disabled || state === 'loading'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Hidden honeypot */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] w-px h-px opacity-0"
        aria-hidden="true"
      />

      {disabled && (
        <div className="bg-gray-100 rounded-xl p-3 text-center">
          <p className="text-gray-500 text-sm font-medium">Registration is now closed for this event.</p>
        </div>
      )}

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <div>
        <label htmlFor={`${uid}-firstName`} className="block text-xs font-medium text-gray-300 mb-1">
          First name
        </label>
        <input
          id={`${uid}-firstName`}
          name="firstName"
          type="text"
          autoComplete="given-name"
          placeholder="Enter your first name"
          value={values.firstName}
          onChange={handleChange}
          disabled={isDisabled}
          className={`w-full px-3.5 py-2 rounded-md border text-sm placeholder-gray-400 outline-none transition-colors
            ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-gray-400'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
        />
        {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
      </div>

      <div>
        <label htmlFor={`${uid}-lastName`} className="block text-xs font-medium text-gray-300 mb-1">
          Last name
        </label>
        <input
          id={`${uid}-lastName`}
          name="lastName"
          type="text"
          autoComplete="family-name"
          placeholder="Enter your last name"
          value={values.lastName}
          onChange={handleChange}
          disabled={isDisabled}
          className={`w-full px-3.5 py-2 rounded-md border text-sm placeholder-gray-400 outline-none transition-colors
            ${errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-gray-400'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
        />
        {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
      </div>

      <div>
        <label htmlFor={`${uid}-email`} className="block text-xs font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={values.email}
          onChange={handleChange}
          disabled={isDisabled}
          className={`w-full px-3.5 py-2 rounded-md border text-sm placeholder-gray-400 outline-none transition-colors
            ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-gray-400'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor={`${uid}-phoneNumber`} className="block text-xs font-medium text-gray-300 mb-1">
          Phone number
        </label>
        <input
          id={`${uid}-phoneNumber`}
          name="phoneNumber"
          type="tel"
          autoComplete="tel"
          placeholder="+2348012345678"
          value={values.phoneNumber}
          onChange={handleChange}
          disabled={isDisabled}
          className={`w-full px-3.5 py-2 rounded-md border text-sm placeholder-gray-400 outline-none transition-colors
            ${errors.phoneNumber ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-gray-400'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
        />
        {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>}
      </div>

      <div className="flex items-start gap-2.5 pt-1">
        <input
          id="privacyPolicy"
          name="privacyPolicy"
          type="checkbox"
          checked={values.privacyPolicy}
          onChange={handleChange}
          disabled={isDisabled}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-amber-500 cursor-pointer"
        />
        <label htmlFor={`${uid}-privacyPolicy`} className="text-xs text-gray-300 cursor-pointer leading-relaxed">
          By clicking register, you will receive notifications for upcoming events and our monthly
          community newsletter directly via mail.
        </label>
      </div>
      {errors.privacyPolicy && <p className="text-xs text-red-500 -mt-2">{errors.privacyPolicy}</p>}

      <button
        type="submit"
        disabled={isDisabled}
        className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
          disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: '#E8A33D', color: '#0B0E14' }}
      >
        {state === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Registering…
          </>
        ) : disabled ? (
          'Registration Closed'
        ) : (
          'Register'
        )}
      </button>
    </form>
  )
}
