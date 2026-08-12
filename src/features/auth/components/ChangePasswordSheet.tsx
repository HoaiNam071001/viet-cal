import { useState, type FormEvent } from 'react'
import { updatePassword } from '@/features/auth/services/auth.service'
import { toAuthErrorMessage } from '@/features/auth/types/auth'
import { Button } from '@/shared/components/ui/Button'
import { Sheet } from '@/shared/components/ui/Sheet'
import { AuthTextField } from './AuthTextField'

interface ChangePasswordSheetProps {
  open: boolean
  onClose: () => void
}

export function ChangePasswordSheet({ open, onClose }: ChangePasswordSheetProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const close = () => {
    setPassword('')
    setConfirmPassword('')
    setError(null)
    setSuccess(false)
    onClose()
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.')
      return
    }
    setIsSubmitting(true)
    try {
      await updatePassword(password)
      setSuccess(true)
    } catch (err) {
      setError(toAuthErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onClose={close} title="Đổi mật khẩu" desktopVariant="dialog">
      {success ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <p className="text-text text-sm font-medium">Đã đổi mật khẩu thành công.</p>
          <Button variant="primary" size="lg" onClick={close} className="w-full">
            Đóng
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <AuthTextField
            label="Mật khẩu mới"
            name="new-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <AuthTextField
            label="Nhập lại mật khẩu mới"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          {error ? <p className="text-primary text-sm">{error}</p> : null}

          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu…' : 'Đổi mật khẩu'}
          </Button>
        </form>
      )}
    </Sheet>
  )
}
