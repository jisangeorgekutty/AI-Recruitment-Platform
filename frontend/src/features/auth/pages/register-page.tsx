import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerSchema, type RegisterFormData } from '../schemas'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth-store'
import { AuthCard } from '../components/auth-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const result = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
      })
      login(result.user, result.accessToken, result.refreshToken)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard title="Create an account" description="Start your AI-powered recruitment journey">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="name"
          label="Full Name"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          id="companyName"
          label="Company Name"
          placeholder="Acme Corp"
          error={errors.companyName?.message}
          {...register('companyName')}
        />
        <div className="relative">
          <Input
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}
