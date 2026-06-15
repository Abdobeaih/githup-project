import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { loginSchema, type LoginFormData } from '../../schemas'
import { useAuthStore } from '../../stores'
import { Button, Input, PasswordInput } from '../../components/ui'
import { handleApiError } from '../../api'
import { authApi } from '../../api'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [error, setError] = useState('')

  const from = (location.state as any)?.from?.pathname || '/dashboard'

  const { register, watch, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('')
      const res = await authApi.login(data.email, data.password)
      const { user, token } = res.data.data
      const role = res.data.data.role || 'user'
      const userWithRole = { ...user, role }
      setAuth(userWithRole, token)
      const redirectMap: Record<string, string> = {
        admin: '/dashboard/admin',
        company: '/dashboard/company',
        user: '/dashboard/user',
      }
      navigate(redirectMap[role] || '/dashboard/user', { replace: true })
    } catch (err) {
      setError(handleApiError(err))
    }
  }

  return (
    <div className="min-h-screen bg-cream/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-gold/10 p-8">
          <div className="text-center mb-8">
<Link to="/" className="text-2xl font-extrabold text-dark">
  <span className="text-gold">Freelancer</span> 360
</Link>
            <h1 className="text-2xl font-bold text-dark mt-4">Login</h1>
            <p className="text-dark/50 text-sm mt-1">Welcome back to Freelancer 360</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <Input
              label="Email"
              type="email"
              placeholder="example@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              value={watch('password')}
              showStrength={false}
              className="w-full px-4 py-2.5 rounded-xl border text-sm bg-cream/30 text-dark placeholder-dark/40 border-gold/20 focus:ring-gold/40 focus:border-gold/30 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              {...register('password')}
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button type="submit" variant="gold" fullWidth loading={isSubmitting} icon={<LogIn size={18} />}>
              Login
            </Button>
          </form>



          <p className="text-center text-sm text-dark/50 mt-6">
            Don't have an account?{' '}
            <Link to="/join" className="text-gold font-bold hover:underline">Sign Up Now</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
