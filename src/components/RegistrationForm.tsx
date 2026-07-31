'use client'

import { useState, useRef } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { registrationSchema } from '@/lib/schemas'

interface RegistrationFormProps {
  eventId: string
  disabled?: boolean
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  privacyPolicy?: string
  general?: string
}

export function RegistrationForm({ eventId, disabled = false }: RegistrationFormProps) {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    privacyPolicy: false,
  })

  // Honeypot ref — hidden from users, visible to bots
  const honeypotRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear field-level error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Honeypot check
    if (honeypotRef.current?.value) return

    // Client-side validation
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

      const data = await res.json()

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

  // Success state
  if (state === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
        <CheckCircle size={48} className="text-green-500" />
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-1">You&apos;re registered!</h3>
          <p className="text-gray-500 text-sm">Check your email for a confirmation message.</p>
        </div>
      </div>
    )
  }

  const isDisabled = disabled || state === 'loading'

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Hidden honeypot */}
      <input
        ref={honeypotRef}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />

      {/* Disabled banner */}
      {disabled && (
        <div className="bg-gray-100 rounded-xl p-1 text-center">
          <p className="text-gray-500 text-sm font-medium">Registration is now closed for this event.</p>
        </div>
      )}

      {/* General error */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      {/* First name */}
      <div>
        <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">
          First name
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          autoComplete="given-name"
          placeholder="Enter your first name"
          value={values.firstName}
          onChange={handleChange}
          disabled={isDisabled}
          className={`w-full px-3.5 py-1 rounded-md border text-sm placeholder-gray-400 outline-none transition-colors
            ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-gray-400'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
        />
        {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
      </div>

      {/* Last name */}
      <div>
        <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">
          Last name
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          autoComplete="family-name"
          placeholder="Enter your last name"
          value={values.lastName}
          onChange={handleChange}
          disabled={isDisabled}
          className={`w-full px-3.5 py-1 rounded-md border text-sm placeholder-gray-400 outline-none transition-colors
            ${errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-gray-400'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
        />
        {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={values.email}
          onChange={handleChange}
          disabled={isDisabled}
          className={`w-full px-3.5 py-1 rounded-md border text-sm placeholder-gray-400 outline-none transition-colors
            ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-gray-400'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* Privacy policy checkbox */}
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
        <label htmlFor="privacyPolicy" className="text-xs text-gray-300 cursor-pointer leading-relaxed">
By clicking register,you will receive notifications for upcoming events and our monthly community newsletter directly via mail.
        </label>
      </div>
      {errors.privacyPolicy && <p className="-mt-2 text-xs text-red-500">{errors.privacyPolicy}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={isDisabled}
        className="w-full py-1 rounded-xl font-semibold text-sm text-navy transition-all duration-200 flex items-center justify-center gap-2
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
