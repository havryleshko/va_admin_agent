import { formatDistanceToNow } from 'date-fns'
import { Send, Trash2, User, Clock, Tag } from 'lucide-react'
import { Email } from '@/types/email'
import { clsx } from 'clsx'

interface EmailDetailProps {
  email: Email
  onSend: () => void
  onDiscard: () => void
}

const categoryColors = {
  'Invoice/Payment': 'bg-red-100 text-red-800',
  'Meeting': 'bg-blue-100 text-blue-800',
  'Lead': 'bg-green-100 text-green-800',
  'Recruitment': 'bg-purple-100 text-purple-800',
  'Customer Support': 'bg-orange-100 text-orange-800',
  'Internal': 'bg-gray-100 text-gray-800',
  'General': 'bg-yellow-100 text-yellow-800',
  'Other': 'bg-gray-100 text-gray-800',
}

// Helper function to convert timestamp to Date
const parseTimestamp = (timestamp: Date | string): Date => {
  if (timestamp instanceof Date) return timestamp
  return new Date(timestamp)
}

export default function EmailDetail({ email, onSend, onDiscard }: EmailDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Email Header */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">{email.subject}</h2>
          <span className={clsx(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            categoryColors[email.category]
          )}>
            {email.category}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{email.sender}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNow(parseTimestamp(email.timestamp), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Email Content</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{email.snippet}</p>
        </div>
      </div>

      {/* Draft Reply */}
      {email.draftReply && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Draft Reply</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{email.draftReply}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onSend}
          className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Send className="h-4 w-4" />
          <span>Send Reply</span>
        </button>
        <button
          onClick={onDiscard}
          className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Discard</span>
        </button>
      </div>
    </div>
  )
}
