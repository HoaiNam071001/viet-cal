import type { TFunction } from 'i18next'

export interface AuthFormError {
  message: string
}

/** Maps Supabase's English auth errors to localized copy users actually understand. */
export function toAuthErrorMessage(error: unknown, t: TFunction): string {
  const raw = error instanceof Error ? error.message : String(error)
  const known: Record<string, string> = {
    'Invalid login credentials': t('auth.errors.invalidCredentials'),
    'User already registered': t('auth.errors.alreadyRegistered'),
    'Email not confirmed': t('auth.errors.emailNotConfirmed'),
    'Password should be at least 6 characters': t('auth.errors.passwordTooShort'),
  }
  return known[raw] ?? raw
}
