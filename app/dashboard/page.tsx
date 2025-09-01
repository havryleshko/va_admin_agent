'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Send, Trash2, RefreshCw, User, Clock, Tag, LogOut, AlertCircle } from 'lucide-react'
import EmailCard from '@/components/EmailCard'
import EmailDetail from '@/components/EmailDetail'
import { Email } from '@/types/email'
import { fetchEmails, classifyEmails, generateDraftReplies, sendEmailReply, discardEmail, getEmailStats, EmailStats } from '@/lib/api'
import { GoogleTokens, getGoogleTokensFromUrl, storeGoogleTokens, getStoredGoogleTokens } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [googleTokens, setGoogleTokens] = useState<GoogleTokens | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [stats, setStats] = useState<EmailStats>({
    total: 0,
    unread: 0,
    categorized: 0
  })

  // Check for Google tokens in URL and store them
  useEffect(() => {
    const tokens = getGoogleTokensFromUrl()
    if (tokens) {
      console.log('🔍 AUTH DEBUG: Found Google tokens in URL, storing them...')
      storeGoogleTokens(tokens)
      setGoogleTokens(tokens)
      setDebugInfo('Google tokens found and stored')
      
      // Clean up URL
      const url = new URL(window.location.href)
      url.search = ''
      window.history.replaceState({}, '', url.toString())
    } else {
      // Try to get stored tokens
      const storedTokens = getStoredGoogleTokens()
      if (storedTokens) {
        console.log('🔍 AUTH DEBUG: Using stored Google tokens')
        setGoogleTokens(storedTokens)
        setDebugInfo('Using stored Google tokens')
      } else {
        console.log('🔍 AUTH DEBUG: No Google tokens found')
        setDebugInfo('No Google tokens found - need to re-authenticate')
        // Redirect to login if no tokens
        router.push('/login')
        return
      }
    }
  }, [router])

  // Load real email data when we have Google tokens
  useEffect(() => {
    if (googleTokens) {
      console.log('🔍 DEBUG: Google tokens available, loading emails...')
      console.log('🔍 DEBUG: Google tokens available:', !!googleTokens)
      console.log('🔍 DEBUG: API Base URL:', process.env.NEXT_PUBLIC_BACKEND_URL || 'Not set')
      loadEmails()
    }
  }, [googleTokens])

  const loadEmails = async () => {
    if (!googleTokens) {
      console.log('❌ DEBUG: Missing Google tokens')
      setDebugInfo('Missing Google tokens - need to re-authenticate')
      return
    }
    
    setLoading(true)
    setError(null)
    setDebugInfo('Loading emails...')
    
    try {
      console.log('🔍 DEBUG: Starting email fetch...')
      console.log('🔍 DEBUG: API Base URL:', process.env.NEXT_PUBLIC_BACKEND_URL || 'Not set')
      
      // Fetch unread emails from Gmail
      const fetchedEmails = await fetchEmails(googleTokens)
      console.log('🔍 DEBUG: Fetched emails:', fetchedEmails)
      setDebugInfo(`Fetched ${fetchedEmails.length} emails`)
      
      // Classify emails using AI
      const classifiedEmails = await classifyEmails(fetchedEmails, googleTokens)
      console.log('🔍 DEBUG: Classified emails:', classifiedEmails)
      
      // Generate draft replies
      const emailsWithDrafts = await generateDraftReplies(classifiedEmails, googleTokens)
      console.log('🔍 DEBUG: Emails with drafts:', emailsWithDrafts)
      
      setEmails(emailsWithDrafts)
      
      // Update stats
      const emailStats = await getEmailStats(googleTokens)
      setStats(emailStats)
      
    } catch (err) {
      console.error('❌ DEBUG: Error loading emails:', err)
      setError('Failed to load emails. Please try again.')
      setDebugInfo(`Error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    await loadEmails()
  }

  const handleSendEmail = async (emailId: string) => {
    if (!googleTokens) return
    
    try {
      const email = emails.find(e => e.id === emailId)
      if (!email?.draftReply) return
      
      const success = await sendEmailReply(emailId, email.draftReply, googleTokens)
      
      if (success) {
        // Remove email from list after sending
        setEmails(prev => prev.filter(e => e.id !== emailId))
        if (selectedEmail?.id === emailId) {
          setSelectedEmail(null)
        }
        // Refresh stats
        const emailStats = await getEmailStats(googleTokens)
        setStats(emailStats)
      }
    } catch (err) {
      console.error('Error sending email:', err)
      setError('Failed to send email. Please try again.')
    }
  }

  const handleDiscardEmail = async (emailId: string) => {
    if (!googleTokens) return
    
    try {
      const success = await discardEmail(emailId, googleTokens)
      
      if (success) {
        setEmails(prev => prev.filter(e => e.id !== emailId))
        if (selectedEmail?.id === emailId) {
          setSelectedEmail(null)
        }
        // Refresh stats
        const emailStats = await getEmailStats(googleTokens)
        setStats(emailStats)
      }
    } catch (err) {
      console.error('Error discarding email:', err)
      setError('Failed to discard email. Please try again.')
    }
  }

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
  }

  const handleLogout = async () => {
    // Clear Google tokens and redirect to login
    localStorage.removeItem('google_tokens')
    router.push('/login')
  }

  if (!googleTokens) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">VA Admin Agent</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{userEmail || 'Google User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Debug Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">🔍 Debug Information</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_BACKEND_URL || 'Not set'}</p>
            <p><strong>User Email:</strong> {userEmail || 'Not set'}</p>
            <p><strong>Google Tokens:</strong> {googleTokens ? 'Available' : 'Missing'}</p>
            <p><strong>Debug Info:</strong> {debugInfo}</p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Emails</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categorized</p>
                <p className="text-2xl font-bold text-gray-900">{stats.categorized}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Inbox</h2>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center space-x-2 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {emails.map((email) => (
                  <EmailCard
                    key={email.id}
                    email={email}
                    isSelected={selectedEmail?.id === email.id}
                    onClick={() => handleEmailClick(email)}
                    onSend={() => handleSendEmail(email.id)}
                    onDiscard={() => handleDiscardEmail(email.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Email Detail */}
          <div className="lg:col-span-1">
            {selectedEmail ? (
              <EmailDetail
                email={selectedEmail}
                onSend={() => handleSendEmail(selectedEmail.id)}
                onDiscard={() => handleDiscardEmail(selectedEmail.id)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-4" />
                  <p>Select an email to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
