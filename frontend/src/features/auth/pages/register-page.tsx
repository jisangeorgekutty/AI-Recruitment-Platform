import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, User, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerSchema, type RegisterFormData } from '../schemas'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth-store'
import { useGoogleAuth } from '@/hooks/use-google-auth'
import { AuthCard } from '../components/auth-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GoogleIcon } from '@/components/icons/google-icon'

export default function RegisterPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const { promptGoogleSignIn } = useGoogleAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'candidate',
    },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        companyName: data.role === 'recruiter' ? data.companyName : undefined,
        role: data.role,
      })

      // Perform login after successful registration
      const loginResult = await authService.login({
        email: data.email,
        password: data.password,
      })

      login(loginResult.user, loginResult.accessToken, loginResult.refreshToken)
      toast.success(`Account created as ${data.role === 'candidate' ? 'Candidate' : 'Recruiter'}!`)
      navigate(data.role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = () => {
    setIsGoogleLoading(true)
    const success = promptGoogleSignIn(async (idToken) => {
      try {
        const result = await authService.googleLogin(selectedRole, idToken)
        login(result.user, result.accessToken, result.refreshToken)
        toast.success(`Signed up with Google as ${selectedRole === 'candidate' ? 'Candidate' : 'Recruiter'}!`)
        navigate(selectedRole === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard')
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Google registration failed. Please try again.'
        toast.error(msg)
      } finally {
        setIsGoogleLoading(false)
      }
    })

    if (!success) {
      setIsGoogleLoading(false)
    }
  }

  return (
    <AuthCard title="Create an account" description="Start your AI-powered recruitment journey">
      {/* Role Selection Toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-muted/60 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setValue('role', 'candidate')
            clearErrors('companyName')
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
            selectedRole === 'candidate'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="h-4 w-4" />
          Job Seeker
        </button>
        <button
          type="button"
          onClick={() => setValue('role', 'recruiter')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
            selectedRole === 'recruiter'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Recruiter
        </button>
      </div>

      {/* Google OAuth Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 relative flex items-center justify-center gap-3 border-input hover:bg-accent/50 font-medium shadow-sm transition-all"
        onClick={handleGoogleRegister}
        loading={isGoogleLoading}
      >
        {!isGoogleLoading && <GoogleIcon className="h-5 w-5" />}
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground font-medium">Or continue with</span>
        </div>
      </div>

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
          placeholder={selectedRole === 'recruiter' ? 'name@company.com' : 'name@example.com'}
          error={errors.email?.message}
          {...register('email')}
        />

        {selectedRole === 'recruiter' && (
          <Input
            id="companyName"
            label="Company Name"
            placeholder="Acme Corp"
            error={errors.companyName?.message}
            {...register('companyName')}
          />
        )}

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
          {selectedRole === 'candidate' ? 'Register as Candidate' : 'Register as Recruiter'}
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
