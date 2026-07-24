import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginSchema, type LoginFormData } from '../schemas'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth-store'
import { useGoogleAuth } from '@/hooks/use-google-auth'
import { AuthCard } from '../components/auth-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GoogleIcon } from '@/components/icons/google-icon'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const { promptGoogleSignIn } = useGoogleAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case 'candidate': return '/candidate/dashboard'
      case 'admin': return '/admin/dashboard'
      default: return '/recruiter/dashboard'
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await authService.login(data)
      login(result.user, result.accessToken, result.refreshToken)
      toast.success('Welcome back!')
      navigate(getDashboardRoute(result.user.role))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid email or password'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    const success = promptGoogleSignIn(async (idToken) => {
      try {
        const result = await authService.googleLogin(undefined, idToken)
        login(result.user, result.accessToken, result.refreshToken)
        toast.success('Signed in with Google!')
        navigate(getDashboardRoute(result.user.role))
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.'
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
    <AuthCard title="Sign in" description="Enter your credentials to access your account">
      {/* Google OAuth Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 relative flex items-center justify-center gap-3 border-input hover:bg-accent/50 font-medium shadow-sm transition-all"
        onClick={handleGoogleLogin}
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
          id="email"
          label="Email"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />
        <div className="relative">
          <Input
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            error={errors.password?.message}
            autoComplete="current-password"
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
        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
          Sign in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </AuthCard>
  )
}
