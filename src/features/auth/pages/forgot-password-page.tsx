import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas'
import { authService } from '@/services/auth.service'
import { AuthCard } from '../components/auth-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await authService.forgotPassword(data.email)
      setSent(true)
      toast.success('Reset link sent to your email')
    } catch {
      toast.error('Failed to send reset link')
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthCard title="Check your email" description="We've sent a password reset link to your email">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If an account exists with that email, you will receive a password reset link shortly.
          </p>
          <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
            Send again
          </Button>
          <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
          </p>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Forgot password" description="Enter your email and we'll send you a reset link">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
          Send reset link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  )
}
