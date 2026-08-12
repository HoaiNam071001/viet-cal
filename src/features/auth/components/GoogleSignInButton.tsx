import { useState } from 'react'
import { signInWithGoogle } from '@/features/auth/services/auth.service'
import { toAuthErrorMessage } from '@/features/auth/types/auth'
import { Button } from '@/shared/components/ui/Button'

export function GoogleSignInButton({ onError }: { onError: (message: string) => void }) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const onClick = async () => {
    setIsRedirecting(true)
    try {
      await signInWithGoogle()
      // Success navigates away to Google — nothing left to do here.
    } catch (err) {
      onError(toAuthErrorMessage(err))
      setIsRedirecting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={onClick}
      disabled={isRedirecting}
      className="w-full gap-2.5"
    >
      <GoogleIcon className="size-4.5" />
      {isRedirecting ? 'Đang chuyển hướng…' : 'Tiếp tục với Google'}
    </Button>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.07-1.48-.22-2.14H12v3.88h6.6c-.13 1.07-.85 2.68-2.45 3.76l-.02.15 3.56 2.76.25.02c2.26-2.09 3.58-5.17 3.58-8.43z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.06 7.94-2.9l-3.78-2.93c-1.02.7-2.4 1.19-4.16 1.19-3.18 0-5.88-2.09-6.84-4.99l-.14.01-3.7 2.86-.05.13C3.25 21.34 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.16 14.37A7.16 7.16 0 0 1 4.77 12c0-.82.14-1.62.38-2.37l-.01-.16-3.75-2.9-.12.06A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.37l3.89-3z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c2.25 0 3.77.97 4.64 1.79l3.39-3.3C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.66 1.27 6.63l3.88 3.01C6.12 6.84 8.82 4.75 12 4.75z"
      />
    </svg>
  )
}
