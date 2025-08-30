'use client'

import { useState } from 'react'
import { Mail, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SupabaseLoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setError('')
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })

      if (error) {
        console.error('OAuth error:', error)
        setError(error.message)
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <Mail className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to VA Admin Agent
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage your emails with AI assistance
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Google OAuth Button */}
          <div>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  Continue with Google
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            <p>Powered by Supabase Authentication</p>
          </div>
        </div>
      </div>
    </div>
  )
}
