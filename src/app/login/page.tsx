"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Home } from 'lucide-react'

import AuthCard from "@/components/auth/AuthCard"
import AuthBrandPanel from "@/components/auth/AuthBrandPanel"
import LoginForm from "@/components/auth/LoginForm"
import type { AuthStatus, LoginFormValues } from "@/types/auth"

export default function LoginPage() {
  const router = useRouter()
  const [status, setStatus] = useState<AuthStatus>({ type: "idle" })

  const handleSubmit = async (values: LoginFormValues) => {
    setStatus({ type: "loading" })

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe.toString(),
      })
      
      if (res?.error || !res?.ok) {
        setStatus({ type: "error", message: 'Invalid email or password.' })
      } else {
        setStatus({ type: "success", message: 'Logging you in...' })
        router.push('/dashboard')
      }
    } catch (err) {
      setStatus({ type: "error", message: 'A network error occurred. Please try again.' })
    }
  }

  const handleGoogleSignIn = () => {
    setStatus({ type: "loading" })
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center overflow-x-hidden bg-background-sage p-4 md:p-6 font-sans relative">
      <Link 
        href="/" 
        className="absolute top-6 left-6 p-2.5 bg-white/80 hover:bg-white rounded-full shadow-sm backdrop-blur-sm transition-all border border-outline-variant text-on-surface-variant hover:text-primary z-50 flex items-center justify-center group"
      >
        <Home size={20} className="group-hover:scale-110 transition-transform" />
      </Link>
      <AuthCard>
        <AuthBrandPanel />
        <section className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2 lg:p-12">
          <LoginForm 
            onSubmit={handleSubmit} 
            onGoogleSignIn={handleGoogleSignIn} 
            status={status} 
          />
        </section>
      </AuthCard>
    </div>
  )
}

