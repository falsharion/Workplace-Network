import { z } from 'zod'

export const registrationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  privacyPolicy: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to the privacy policy',
    }),
  // Honeypot field — must be empty
  website: z.string().max(0, 'Bot detected').optional(),
})

export type RegistrationInput = z.infer<typeof registrationSchema>

export const emailSubscribeSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

export type EmailSubscribeInput = z.infer<typeof emailSubscribeSchema>
export const groupRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(80),
  lastName: z.string().min(1, 'Last name is required').max(80),
  email: z.string().email('Enter a valid email address'),
  yearsOfExperience: z.enum(['under-5', '5-9', '10-plus']),
  website: z.string().max(0).optional(),
})
// Add this into src/lib/schemas.ts (alongside registrationSchema, etc.)
// Only email, firstName, lastName, phoneCountryCode, phoneNumber, and
// yearsOfExperience are required — everything else is optional.

// Add this into src/lib/schemas.ts (alongside registrationSchema, etc.)
// Only email, firstName, lastName, phoneCountryCode, phoneNumber, and
// yearsOfExperience are required — everything else is optional.

export const interestFormSchema = z.object({
  // Required
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  firstName: z.string().min(1, 'First name is required').max(80),
  lastName: z.string().min(1, 'Last name is required').max(80),
phoneNumber: z
  .string()
  .min(8, 'Enter a valid phone number')
  .max(16)
  .regex(/^\+[1-9]\d{7,14}$/, 'Enter a valid phone number'),
  yearsOfExperience: z.enum(['under-5', '5-9', '10-plus']),

  // Optional
  ageRange: z.enum(['under-18', '18-24', '25-34', '35-44', '45-plus']).optional(),
  jobRole: z.string().max(120).optional().or(z.literal('')),
  industry: z.string().max(120).optional().or(z.literal('')),
  motivation: z.string().max(2000).optional().or(z.literal('')),
  weeklyCommitment: z.enum(['yes', 'no']).optional(),
  preferredMentor: z.string().max(160).optional().or(z.literal('')),
  mentorReason: z.string().max(2000).optional().or(z.literal('')),
  technicalSkills: z.array(z.string().min(1)).default([]),
  softSkills: z.array(z.string().min(1)).default([]),
  workforceInterest: z.enum(['yes', 'no']).optional(),
  workforceDepartments: z
    .array(z.enum(['tech', 'media-comms', 'onboarding', 'admin', 'conference', 'outreach']))
    .default([]),
  referralSource: z.enum(['social-media', 'friend-colleague', 'wpn-conference', 'website', 'other']).optional(),

  // Honeypot — must stay empty
  website: z.string().max(0).optional(),
})

export type InterestFormInput = z.infer<typeof interestFormSchema>