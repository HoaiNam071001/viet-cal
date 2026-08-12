export interface AuthFormError {
  message: string
}

/** Maps Supabase's English auth errors to Vietnamese copy users actually understand. */
export function toAuthErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error)
  const known: Record<string, string> = {
    'Invalid login credentials': 'Email hoặc mật khẩu không đúng.',
    'User already registered': 'Email này đã được đăng ký.',
    'Email not confirmed': 'Vui lòng xác nhận email trước khi đăng nhập.',
    'Password should be at least 6 characters': 'Mật khẩu cần tối thiểu 6 ký tự.',
  }
  return known[raw] ?? raw
}
